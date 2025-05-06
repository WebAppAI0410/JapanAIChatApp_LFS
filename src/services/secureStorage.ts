import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types';

export interface ApiKeys {
  openRouter?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'lite' | 'heavy';
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

export interface UsageStats {
  [modelId: string]: {
    count: number;
    lastReset: number;
  };
}

const KEYS = {
  API_KEYS: 'api_keys',
  USER_PROFILE: 'user_profile',
  CONVERSATIONS: 'conversations',
  CONVERSATION_PREFIX: 'conversation_',
  USAGE_STATS: 'usage_stats',
  CONVERSATION_HISTORY: 'conversation_history',
};

/**
 * Check if SecureStore can be used (not available on web)
 */
const canUseSecureStore = (): boolean => {
  return Platform.OS !== 'web';
};

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

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    if (canUseSecureStore()) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error setting secure item ${key}:`, error);
    throw error;
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    if (canUseSecureStore()) {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error(`Error getting secure item ${key}:`, error);
    return null;
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    if (canUseSecureStore()) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing secure item ${key}:`, error);
    throw error;
  }
};

/**
 * Save API keys
 */
export const saveApiKeys = async (keys: ApiKeys): Promise<void> => {
  await saveSecurely(KEYS.API_KEYS, keys);
};

/**
 * Get API keys
 */
export const getApiKeys = async (): Promise<ApiKeys | null> => {
  return await getSecurely<ApiKeys>(KEYS.API_KEYS);
};

/**
 * Save user profile
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await saveSecurely(KEYS.USER_PROFILE, profile);
};

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  return await getSecurely<UserProfile>(KEYS.USER_PROFILE);
};

/**
 * Create default user profile
 */
export const createDefaultUserProfile = async (): Promise<UserProfile> => {
  const defaultProfile: UserProfile = {
    id: uuidv4(),
    name: 'ユーザー',
    plan: 'free',
    createdAt: Date.now(),
  };
  await saveUserProfile(defaultProfile);
  return defaultProfile;
};

/**
 * Save conversation history (legacy method)
 */
export const saveConversationHistory = async (conversations: Conversation[]): Promise<void> => {
  await saveSecurely(KEYS.CONVERSATION_HISTORY, conversations);
};

/**
 * Get conversation history (legacy method)
 */
export const getConversationHistory = async (): Promise<Conversation[] | null> => {
  return await getSecurely<Conversation[]>(KEYS.CONVERSATION_HISTORY);
};

/**
 * Save a single conversation
 */
export const saveConversation = async (conversation: Conversation): Promise<void> => {
  await setSecureItem(
    `${KEYS.CONVERSATION_PREFIX}${conversation.id}`,
    JSON.stringify(conversation)
  );
  
  const conversationsJson = await getSecureItem(KEYS.CONVERSATIONS);
  let conversations: string[] = conversationsJson ? JSON.parse(conversationsJson) : [];
  
  if (!conversations.includes(conversation.id)) {
    conversations.push(conversation.id);
    await setSecureItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
  
  const conversationHistory = await getConversationHistory() || [];
  const existingIndex = conversationHistory.findIndex(c => c.id === conversation.id);
  
  if (existingIndex >= 0) {
    conversationHistory[existingIndex] = conversation;
  } else {
    conversationHistory.push(conversation);
  }
  
  await saveConversationHistory(conversationHistory);
};

/**
 * Get a single conversation by ID
 */
export const getConversationById = async (id: string): Promise<Conversation | null> => {
  const conversationJson = await getSecureItem(`${KEYS.CONVERSATION_PREFIX}${id}`);
  if (conversationJson) {
    return JSON.parse(conversationJson);
  }
  
  // Fallback to conversation history
  const conversations = await getConversationHistory() || [];
  const conversation = conversations.find(c => c.id === id);
  return conversation || null;
};

/**
 * Get all conversations
 */
export const getAllConversations = async (): Promise<Conversation[]> => {
  const conversationsJson = await getSecureItem(KEYS.CONVERSATIONS);
  if (!conversationsJson) {
    // Fallback to conversation history
    return await getConversationHistory() || [];
  }
  
  const conversationIds: string[] = JSON.parse(conversationsJson);
  const conversations: Conversation[] = [];
  
  for (const id of conversationIds) {
    const conversation = await getConversationById(id);
    if (conversation) {
      conversations.push(conversation);
    }
  }
  
  return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (id: string): Promise<void> => {
  await removeSecureItem(`${KEYS.CONVERSATION_PREFIX}${id}`);
  
  const conversationsJson = await getSecureItem(KEYS.CONVERSATIONS);
  if (conversationsJson) {
    let conversations: string[] = JSON.parse(conversationsJson);
    conversations = conversations.filter(convId => convId !== id);
    await setSecureItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
  
  const conversationHistory = await getConversationHistory() || [];
  const updatedHistory = conversationHistory.filter(c => c.id !== id);
  await saveConversationHistory(updatedHistory);
};

/**
 * Save usage stats
 */
export const saveUsageStats = async (stats: UsageStats): Promise<void> => {
  await setSecureItem(KEYS.USAGE_STATS, JSON.stringify(stats));
};

/**
 * Get usage stats
 */
export const getUsageStats = async (): Promise<UsageStats> => {
  const statsJson = await getSecureItem(KEYS.USAGE_STATS);
  if (!statsJson) return {};
  return JSON.parse(statsJson);
};

/**
 * Increment model usage
 */
export const incrementModelUsage = async (modelId: string): Promise<boolean> => {
  try {
    const stats = await getUsageStats();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (!stats[modelId]) {
      stats[modelId] = {
        count: 0,
        lastReset: now,
      };
    }
    
    if (now - stats[modelId].lastReset > oneDayMs) {
      stats[modelId] = {
        count: 1, // Count this usage
        lastReset: now,
      };
    } else {
      stats[modelId].count += 1;
    }
    
    await saveUsageStats(stats);
    return true;
  } catch (error) {
    console.error('Error incrementing model usage:', error);
    return false;
  }
};

/**
 * Check usage limit
 */
export const checkUsageLimit = async (modelId: string, plan: string): Promise<boolean> => {
  try {
    const { USAGE_LIMITS, SUBSCRIPTION_PLANS } = await import('./apiConfig');
    
    if (modelId === 'qwen3-4b') {
      return true;
    }
    
    const stats = await getUsageStats();
    if (!stats[modelId]) {
      return true; // No usage yet, so within limits
    }
    
    const limit = USAGE_LIMITS[plan]?.[modelId];
    if (limit === undefined) {
      return false; // Model not available on this plan
    }
    
    if (limit === -1) {
      return true; // Unlimited usage
    }
    
    return stats[modelId].count < limit;
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return false;
  }
};
