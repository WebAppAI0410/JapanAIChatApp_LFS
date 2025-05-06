import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  timestamp 
}) => {
  return (
    <View style={[
      styles.container, 
      isUser ? styles.userContainer : styles.botContainer
    ]}>
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
        <Text style={styles.timestamp}>{timestamp}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginRight: theme.spacing.md,
  },
  botContainer: {
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.md,
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
    alignSelf: 'flex-end',
  },
});
