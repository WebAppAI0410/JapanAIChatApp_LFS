import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="メッセージを入力..."
          placeholderTextColor={theme.colors.placeholder}
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() ? styles.sendButtonDisabled : {}
          ]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={!message.trim() ? theme.colors.placeholder : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.card,
  },
});
