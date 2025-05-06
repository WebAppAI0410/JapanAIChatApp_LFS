import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface ConversationItemProps {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  modelIcon?: string;
  unreadCount?: number;
  onPress: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  title,
  lastMessage,
  timestamp,
  modelIcon,
  unreadCount = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {modelIcon ? (
          <Image source={{ uri: modelIcon }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.text,
    flex: 1,
  },
  timestamp: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginLeft: theme.spacing.sm,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: theme.fontSizes.regular,
    color: theme.colors.placeholder,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontWeights.bold as any,
    paddingHorizontal: 5,
  },
});
