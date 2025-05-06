import Constants from 'expo-constants';
import { getApiKeys } from './secureStorage';

export const API_URLS = {
  OPENROUTER: 'https://openrouter.ai/api/v1/chat/completions',
};

export const MODELS = {
  CLOUD: {
    CHATGPT: 'openai/gpt-4-turbo',
    CLAUDE: 'anthropic/claude-3-opus',
    DEEPSEEK: 'deepseek/deepseek-chat'
  },
  LOCAL: {
    QWEN: 'qwen3-4b'
  }
};

export const FREE_TIER_LIMITS = {
  [MODELS.CLOUD.CHATGPT]: 10,
  [MODELS.CLOUD.CLAUDE]: 5,
  [MODELS.CLOUD.DEEPSEEK]: 15
};

export const MODEL_INFO = {
  [MODELS.CLOUD.CHATGPT]: {
    name: 'ChatGPT-4',
    provider: 'OpenAI',
    description: '最新のGPT-4モデル。高度な理解力と生成能力を持つAIです。',
    isPremium: true,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png'
  },
  [MODELS.CLOUD.CLAUDE]: {
    name: 'Claude 3',
    provider: 'Anthropic',
    description: '自然な会話と長文の理解に優れたAIアシスタント。',
    isPremium: true,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_logo.svg/1200px-Claude_logo.svg.png'
  },
  [MODELS.CLOUD.DEEPSEEK]: {
    name: 'Deepseek',
    provider: 'Deepseek AI',
    description: '高度な知識と推論能力を持つ最新のAIモデル。',
    isPremium: false,
    avatar: 'https://avatars.githubusercontent.com/u/128254862'
  },
  [MODELS.LOCAL.QWEN]: {
    name: 'Qwen3:4B',
    provider: 'Alibaba',
    description: 'オフラインでも使用可能な軽量AIモデル。プライバシーを重視する方に最適。',
    isLocal: true,
    isPremium: false,
    avatar: 'https://qianwen-res.oss-cn-beijing.aliyuncs.com/logo_qwen.png'
  }
};

/**
 * Get OpenRouter API key from secure storage
 * Falls back to environment variable if available
 */
export const getOpenRouterApiKey = async (): Promise<string | null> => {
  const apiKeys = await getApiKeys();
  if (apiKeys?.openRouter) {
    return apiKeys.openRouter;
  }
  
  const envApiKey = Constants.expoConfig?.extra?.openRouterApiKey;
  if (envApiKey) {
    return envApiKey;
  }
  
  return null;
};

/**
 * Check if API key is set
 */
export const isApiKeySet = async (): Promise<boolean> => {
  const apiKey = await getOpenRouterApiKey();
  return apiKey !== null && apiKey !== '';
};

/**
 * Set OpenRouter API key in secure storage
 */
export const setOpenRouterApiKey = async (apiKey: string): Promise<void> => {
  const apiKeys = await getApiKeys() || {};
  apiKeys.openRouter = apiKey;
  
  const { saveApiKeys } = await import('./secureStorage');
  await saveApiKeys(apiKeys);
};
