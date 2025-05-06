import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { ConversationItem } from '../components/ConversationItem';
import { Ionicons } from '@expo/vector-icons';

const mockConversations = [
  {
    id: '1',
    title: 'ChatGPT会話',
    lastMessage: 'こんにちは、何かお手伝いできることはありますか？',
    timestamp: '14:30',
    modelIcon: undefined,
    unreadCount: 0,
  },
  {
    id: '2',
    title: 'Claude会話',
    lastMessage: '日本の歴史について教えてください。',
    timestamp: '昨日',
    modelIcon: undefined,
    unreadCount: 2,
  },
  {
    id: '3',
    title: 'Deepseek会話',
    lastMessage: '最新のAI技術について教えてください。',
    timestamp: '月曜日',
    modelIcon: undefined,
    unreadCount: 0,
  },
  {
    id: '4',
    title: 'Qwen3:4B会話',
    lastMessage: 'オフラインでも使えるAIの利点は何ですか？',
    timestamp: '5/1',
    modelIcon: undefined,
    unreadCount: 0,
  },
];

interface ChatListScreenProps {
  navigation: any;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const [conversations, setConversations] = useState(mockConversations);

  const handleConversationPress = (id: string) => {
    navigation.navigate('Chat', { conversationId: id });
  };

  const handleNewChat = () => {
    navigation.navigate('ModelSelection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>チャット履歴</Text>
      </View>
      
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              id={item.id}
              title={item.title}
              lastMessage={item.lastMessage}
              timestamp={item.timestamp}
              modelIcon={item.modelIcon}
              unreadCount={item.unreadCount}
              onPress={handleConversationPress}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={64} color={theme.colors.placeholder} />
          <Text style={styles.emptyText}>会話履歴がありません</Text>
          <Text style={styles.emptySubtext}>新しいチャットを開始しましょう</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.bold as any,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.medium as any,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.regular,
    color: theme.colors.placeholder,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  newChatButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
});

export default ChatListScreen;
