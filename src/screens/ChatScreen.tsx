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
import { MODELS } from '../services/apiConfig';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  imageUrl?: string;
}

const getAIResponse = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        'こんにちは！何かお手伝いできることはありますか？',
        'それは興味深い質問ですね。詳しく教えていただけますか？',
        '申し訳ありませんが、その質問にはお答えできません。別の質問をどうぞ。',
        'その件については、以下のように考えられます...',
        'ご質問ありがとうございます。調べてみますね。',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 1500);
  });
};

const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

interface ChatScreenProps {
  route: any;
  navigation: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { conversationId, modelId: initialModelId } = route.params || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(initialModelId || MODELS.CLOUD.GPT.MINI_4O);
  const [showImageModal, setShowImageModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: conversationId ? `会話 #${conversationId}` : '新しいチャット',
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#FFFFFF',
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('ModelSelection')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, conversationId]);

  useEffect(() => {
    if (conversationId) {
      const initialMessages: Message[] = [
        {
          id: '1',
          text: 'こんにちは！何かお手伝いできることはありますか？',
          isUser: false,
          timestamp: '14:30',
        },
      ];
      setMessages(initialMessages);
    } else {
      const welcomeMessage: Message = {
        id: '1',
        text: 'こんにちは！新しい会話を始めましょう。何かお手伝いできることはありますか？',
        isUser: false,
        timestamp: getCurrentTime(),
      };
      setMessages([welcomeMessage]);
    }
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleModelChange = (modelId: string) => {
    setCurrentModelId(modelId);
    
    const systemMessage: Message = {
      id: uuidv4(),
      text: `AIモデルが${modelId}に変更されました。`,
      isUser: false,
      timestamp: getCurrentTime(),
    };
    
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: getCurrentTime(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    setIsTyping(true);
    
    try {
      const response = await getAIResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: getCurrentTime(),
      };
      
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'すみません、エラーが発生しました。もう一度お試しください。',
        isUser: false,
        timestamp: getCurrentTime(),
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
    const imageMessage: Message = {
      id: Date.now().toString(),
      text: `画像生成: ${prompt}`,
      isUser: true,
      timestamp: getCurrentTime(),
      imageUrl: imageUrl,
    };
    
    setMessages((prevMessages) => [...prevMessages, imageMessage]);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '画像が生成されました。他に何かお手伝いできることはありますか？',
        isUser: false,
        timestamp: getCurrentTime(),
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    if (item.imageUrl) {
      return (
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {item.text}
          </Text>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.messageImage}
            resizeMode="contain"
          />
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      );
    }
    
    return (
      <ChatBubble
        message={item.text}
        isUser={item.isUser}
        timestamp={item.timestamp}
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
});

export default ChatScreen;
