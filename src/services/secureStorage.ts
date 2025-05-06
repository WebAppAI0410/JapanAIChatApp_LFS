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
};

const canUseSecureStore = (): boolean => {
  return Platform.OS !== 'web';
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

export const saveApiKeys = async (keys: ApiKeys): Promise<void> => {
  await setSecureItem(KEYS.API_KEYS, JSON.stringify(keys));
};

export const getApiKeys = async (): Promise<ApiKeys | null> => {
  const keysJson = await getSecureItem(KEYS.API_KEYS);
  if (!keysJson) return null;
  return JSON.parse(keysJson);
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await setSecureItem(KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const profileJson = await getSecureItem(KEYS.USER_PROFILE);
  if (!profileJson) return null;
  return JSON.parse(profileJson);
};

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
};

export const getConversationById = async (id: string): Promise<Conversation | null> => {
  const conversationJson = await getSecureItem(`${KEYS.CONVERSATION_PREFIX}${id}`);
  if (!conversationJson) return null;
  return JSON.parse(conversationJson);
};

export const getAllConversations = async (): Promise<Conversation[]> => {
  const conversationsJson = await getSecureItem(KEYS.CONVERSATIONS);
  if (!conversationsJson) return [];
  
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

export const deleteConversation = async (id: string): Promise<void> => {
  await removeSecureItem(`${KEYS.CONVERSATION_PREFIX}${id}`);
  
  const conversationsJson = await getSecureItem(KEYS.CONVERSATIONS);
  if (conversationsJson) {
    let conversations: string[] = JSON.parse(conversationsJson);
    conversations = conversations.filter(convId => convId !== id);
    await setSecureItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
};

export const saveUsageStats = async (stats: UsageStats): Promise<void> => {
  await setSecureItem(KEYS.USAGE_STATS, JSON.stringify(stats));
};

export const getUsageStats = async (): Promise<UsageStats> => {
  const statsJson = await getSecureItem(KEYS.USAGE_STATS);
  if (!statsJson) return {};
  return JSON.parse(statsJson);
};

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
