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
  SafeAreaView
} from 'react-native';
import { theme } from '../styles/theme';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
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
  const { conversationId, modelId } = route.params || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item.text}
              isUser={item.isUser}
              timestamp={item.timestamp}
            />
          )}
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
        
        <ChatInput onSendMessage={handleSendMessage} />
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
});

export default ChatScreen;
