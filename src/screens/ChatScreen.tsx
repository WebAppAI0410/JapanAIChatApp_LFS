import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { theme } from '../styles/theme';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { ImageGenerationModal } from '../components/ImageGenerationModal';
import { ModelSwitcher } from '../components/ModelSwitcher';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../types';
import { sendMessageToOpenRouter } from '../services/openRouter';
import { MODELS, MODEL_INFO } from '../services/apiConfig';
import { 
  saveConversation, 
  getConversationById, 
  getUserProfile, 
  getApiKeys 
} from '../services/secureStorage';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  imageUrl?: string;
}

const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

interface ChatScreenProps {
  route: any;
  navigation: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { conversationId, modelId: initialModelId, title } = route.params || {};
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(initialModelId || MODELS.CLOUD.GPT.MINI_4O);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userName, setUserName] = useState('ユーザー');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [conversationTitle, setConversationTitle] = useState(title || '新しいチャット');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const currentConversationId = useRef(conversationId || uuidv4());

  useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setUserName(profile.name);
        setUserAvatar(profile.avatar);
      }
    };
    
    const checkApiKey = async () => {
      const apiKeys = await getApiKeys();
      setIsApiKeySet(!!apiKeys?.openRouter);
    };
    
    loadUserProfile();
    checkApiKey();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: conversationTitle,
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#FFFFFF',
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, conversationTitle]);

  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId) {
        const conversation = await getConversationById(conversationId);
        if (conversation) {
          setMessages(conversation.messages);
          setConversationTitle(conversation.title);
          setCurrentModelId(conversation.modelId);
        }
      } else {
        const welcomeMessage: ChatMessage = {
          id: '1',
          role: 'assistant',
          content: 'こんにちは！新しい会話を始めましょう。何かお手伝いできることはありますか？',
          timestamp: Date.now(),
          model: currentModelId,
        };
        setMessages([welcomeMessage]);
        
        saveConversation({
          id: currentConversationId.current,
          title: conversationTitle,
          messages: [welcomeMessage],
          modelId: currentModelId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    };
    
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveConversation({
        id: currentConversationId.current,
        title: conversationTitle,
        messages,
        modelId: currentModelId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, [messages, currentModelId, conversationTitle]);

  const handleModelChange = (modelId: string) => {
    setCurrentModelId(modelId);
    
    const modelChangeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'system',
      content: `AIモデルが${MODEL_INFO[modelId].name}に変更されました。`,
      timestamp: Date.now(),
      model: modelId,
    };
    
    setMessages((prevMessages) => [...prevMessages, modelChangeMessage]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    if (!isApiKeySet && currentModelId !== MODELS.LOCAL.QWEN) {
      Alert.alert(
        'APIキーが設定されていません',
        'クラウドAIモデルを使用するには、設定画面でOpenRouterのAPIキーを設定してください。',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);
    
    try {
      if (currentModelId !== MODELS.LOCAL.QWEN) {
        const contextMessages = messages
          .filter(msg => msg.role !== 'system') // Filter out system messages
          .slice(-10) // Use last 10 messages for context
          .map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          }));
        
        const messagesForAI = [...contextMessages, userMessage];
        
        const aiResponse = await sendMessageToOpenRouter(messagesForAI, currentModelId);
        
        setMessages((prevMessages) => [...prevMessages, {
          ...aiResponse,
          model: currentModelId,
        }]);
      } else {
        setTimeout(() => {
          const mockResponse: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'これはQwen3:4Bローカルモデルからのテスト応答です。実際の実装では、WebLLMを使用してローカル推論を行います。',
            timestamp: Date.now(),
            model: MODELS.LOCAL.QWEN,
          };
          
          setMessages((prevMessages) => [...prevMessages, mockResponse]);
          setIsTyping(false);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: 'すみません、エラーが発生しました。もう一度お試しください。',
        timestamp: Date.now(),
        model: currentModelId,
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRequestImageGeneration = () => {
    setShowImageModal(true);
  };

  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    const imageMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `画像生成: ${prompt}`,
      timestamp: Date.now(),
      imageUrl: imageUrl,
    };
    
    setMessages((prevMessages) => [...prevMessages, imageMessage]);
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '画像が生成されました。他に何かお手伝いできることはありますか？',
        timestamp: Date.now(),
        model: currentModelId,
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const renderMessageItem = ({ item, index }: { item: ChatMessage, index: number }) => {
    const isUser = item.role === 'user';
    const isSystem = item.role === 'system';
    
    if (isSystem) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.content}</Text>
        </View>
      );
    }
    
    if (item.imageUrl) {
      return (
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {item.content}
          </Text>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.messageImage}
            resizeMode="contain"
          />
          <Text style={styles.timestamp}>{getCurrentTime()}</Text>
        </View>
      );
    }
    
    const showAvatar = index === 0 || 
      messages[index - 1].role !== item.role;
    
    return (
      <ChatBubble
        message={item.content}
        isUser={isUser}
        timestamp={getCurrentTime()}
        userName={userName}
        userAvatar={userAvatar}
        modelId={item.model}
        showAvatar={showAvatar}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.modelSwitcherContainer}>
          <ModelSwitcher
            currentModelId={currentModelId}
            onModelChange={handleModelChange}
          />
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messageList}
        />
        
        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>AIが入力中</Text>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          </View>
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onRequestImageGeneration={handleRequestImageGeneration}
        />
        
        <ImageGenerationModal
          visible={showImageModal}
          onClose={() => setShowImageModal(false)}
          onImageGenerated={handleImageGenerated}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  modelSwitcherContainer: {
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  messageList: {
    paddingVertical: theme.spacing.md,
  },
  typingContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.md,
    ...theme.shadows.small,
  },
  typingText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginRight: theme.spacing.sm,
  },
  headerButton: {
    marginRight: theme.spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  userBubble: {
    backgroundColor: theme.colors.bubble.user,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botBubble: {
    backgroundColor: theme.colors.bubble.bot,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: theme.fontSizes.medium,
    marginBottom: theme.spacing.sm,
  },
  userMessageText: {
    color: theme.colors.bubble.userText,
  },
  botMessageText: {
    color: theme.colors.bubble.botText,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.sm,
  },
  timestamp: {
    fontSize: theme.fontSizes.tiny,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  systemMessageText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    textAlign: 'center',
    backgroundColor: `${theme.colors.card}80`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
});

export default ChatScreen;
