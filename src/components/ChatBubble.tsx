import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { UserAvatar } from './UserAvatar';
import { MODEL_INFO } from '../services/apiConfig';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  userName?: string;
  userAvatar?: string;
  modelId?: string;
  showAvatar?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  timestamp,
  userName = 'ユーザー',
  userAvatar,
  modelId,
  showAvatar = true
}) => {
  const modelInfo = !isUser && modelId ? MODEL_INFO[modelId] : null;
  const avatarName = isUser ? userName : (modelInfo?.name || 'AI');
  const avatarImage = isUser ? userAvatar : (modelInfo?.avatar || undefined);

  return (
    <View style={[
      styles.container, 
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      {showAvatar && !isUser && (
        <View style={styles.avatarContainer}>
          <UserAvatar
            name={avatarName}
            imageUrl={avatarImage}
            size={36}
            backgroundColor={theme.colors.secondary}
          />
        </View>
      )}
      
      <View style={styles.messageContainer}>
        {!isUser && modelInfo && (
          <Text style={styles.modelName}>{modelInfo.name}</Text>
        )}
        
        <View style={[
          styles.bubble, 
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {message}
          </Text>
        </View>
        
        {timestamp && (
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.botTimestamp
          ]}>
            {timestamp}
          </Text>
        )}
      </View>
      
      {showAvatar && isUser && (
        <View style={styles.avatarContainer}>
          <UserAvatar
            name={userName}
            imageUrl={userAvatar}
            size={36}
            backgroundColor={theme.colors.primary}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
    marginLeft: theme.spacing.xl,
    marginRight: theme.spacing.sm,
  },
  botContainer: {
    justifyContent: 'flex-start',
    marginRight: theme.spacing.xl,
    marginLeft: theme.spacing.sm,
  },
  avatarContainer: {
    marginHorizontal: theme.spacing.xs,
  },
  messageContainer: {
    maxWidth: '70%',
  },
  modelName: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginBottom: 2,
    marginLeft: theme.spacing.sm,
  },
  bubble: {
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  userBubble: {
    backgroundColor: theme.colors.bubble.user,
    borderTopRightRadius: theme.spacing.xs,
  },
  botBubble: {
    backgroundColor: theme.colors.bubble.bot,
    borderTopLeftRadius: theme.spacing.xs,
  },
  messageText: {
    fontSize: theme.fontSizes.medium,
  },
  userMessageText: {
    color: theme.colors.bubble.userText,
  },
  botMessageText: {
    color: theme.colors.bubble.botText,
  },
  timestamp: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginTop: theme.spacing.xs,
  },
  userTimestamp: {
    alignSelf: 'flex-end',
    marginRight: theme.spacing.xs,
  },
  botTimestamp: {
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.xs,
  },
});
