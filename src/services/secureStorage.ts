import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  API_KEYS: 'api_keys',
  USER_PROFILE: 'user_profile',
  CONVERSATION_HISTORY: 'conversation_history',
};

export interface ApiKeys {
  openRouter?: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: any[]; // Using any for now, will be replaced with ChatMessage
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Save data securely
 * Uses SecureStore on native platforms and AsyncStorage on web
 */
export const saveSecurely = async (key: string, value: any): Promise<void> => {
  const jsonValue = JSON.stringify(value);
  
  if (Platform.OS === 'web') {
    try {
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
      throw error;
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
      console.error('Error saving data to SecureStore:', error);
      throw error;
    }
  }
};

/**
 * Get data securely
 * Uses SecureStore on native platforms and AsyncStorage on web
 */
export const getSecurely = async <T>(key: string): Promise<T | null> => {
  try {
    let jsonValue: string | null;
    
    if (Platform.OS === 'web') {
      jsonValue = await AsyncStorage.getItem(key);
    } else {
      jsonValue = await SecureStore.getItemAsync(key);
    }
    
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data securely
 */
export const removeSecurely = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Save API keys
 */
export const saveApiKeys = async (apiKeys: ApiKeys): Promise<void> => {
  await saveSecurely(STORAGE_KEYS.API_KEYS, apiKeys);
};

/**
 * Get API keys
 */
export const getApiKeys = async (): Promise<ApiKeys | null> => {
  return await getSecurely<ApiKeys>(STORAGE_KEYS.API_KEYS);
};

/**
 * Save user profile
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await saveSecurely(STORAGE_KEYS.USER_PROFILE, profile);
};

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  return await getSecurely<UserProfile>(STORAGE_KEYS.USER_PROFILE);
};

/**
 * Save conversation history
 */
export const saveConversationHistory = async (conversations: Conversation[]): Promise<void> => {
  await saveSecurely(STORAGE_KEYS.CONVERSATION_HISTORY, conversations);
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (): Promise<Conversation[] | null> => {
  return await getSecurely<Conversation[]>(STORAGE_KEYS.CONVERSATION_HISTORY);
};

/**
 * Save a single conversation
 */
export const saveConversation = async (conversation: Conversation): Promise<void> => {
  const conversations = await getConversationHistory() || [];
  const existingIndex = conversations.findIndex(c => c.id === conversation.id);
  
  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.push(conversation);
  }
  
  await saveConversationHistory(conversations);
};

/**
 * Get a single conversation by ID
 */
export const getConversationById = async (id: string): Promise<Conversation | null> => {
  const conversations = await getConversationHistory() || [];
  const conversation = conversations.find(c => c.id === id);
  return conversation || null;
};
