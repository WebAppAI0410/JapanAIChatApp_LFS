import Constants from 'expo-constants';
import { getApiKeys } from './secureStorage';

export const API_URLS = {
  OPENROUTER: 'https://openrouter.ai/api/v1/chat/completions',
  IMAGE_GENERATION: 'https://openrouter.ai/api/v1/images/generations',
};

export const MODELS = {
  CLOUD: {
    GPT: {
      MINI_4O: 'openai/gpt-4o-mini',
      MINI_41: 'openai/gpt-4.1-mini',
      NANO_41: 'openai/gpt-4.1-nano',
      GPT_4O: 'openai/gpt-4o',
      GPT_41: 'openai/gpt-4.1',
      GPT_45: 'openai/gpt-4.5',
    },
    DEEPSEEK: {
      R1: 'deepseek/deepseek-chat-r1',
      V3: 'deepseek/deepseek-v3',
    },
    GEMINI: {
      PRO_15: 'google/gemini-1.5-pro',
    },
    CLAUDE: {
      SONNET_37: 'anthropic/claude-3.7-sonnet',
    },
    CHATGPT: 'openai/gpt-4o',
    CLAUDE_LEGACY: 'anthropic/claude-3-opus',
    DEEPSEEK_LEGACY: 'deepseek/deepseek-chat',
  },
  LOCAL: {
    QWEN: 'qwen3-4b',
  },
  IMAGE: {
    DALLE3: 'openai/dall-e-3',
    SDXL: 'stability/sdxl',
  },
};

export const MODEL_INFO = {
  [MODELS.CLOUD.GPT.MINI_4O]: {
    name: 'GPT-4o Mini',
    description: '小型で高速なGPT-4oモデル',
    provider: 'OpenAI',
    tier: 'free',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 16000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.MINI_41]: {
    name: 'GPT-4.1 Mini',
    description: '小型で高速なGPT-4.1モデル',
    provider: 'OpenAI',
    tier: 'free',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 16000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.NANO_41]: {
    name: 'GPT-4.1 Nano',
    description: '超小型で高速なGPT-4.1モデル',
    provider: 'OpenAI',
    tier: 'free',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 8000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.GPT_4O]: {
    name: 'GPT-4o',
    description: '高性能なGPT-4oモデル',
    provider: 'OpenAI',
    tier: 'lite',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 128000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.GPT_41]: {
    name: 'GPT-4.1',
    description: '高性能なGPT-4.1モデル',
    provider: 'OpenAI',
    tier: 'lite',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 128000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.GPT_45]: {
    name: 'GPT-4.5',
    description: '最新の高性能GPTモデル',
    provider: 'OpenAI',
    tier: 'heavy',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 128000,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.DEEPSEEK.R1]: {
    name: 'DeepSeek R1',
    description: '高性能な中国製AIモデル',
    provider: 'Deepseek AI',
    tier: 'free',
    avatar: 'https://avatars.githubusercontent.com/u/128254862',
    contextWindow: 32000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.DEEPSEEK.V3]: {
    name: 'DeepSeek V3',
    description: '最新の高性能中国製AIモデル',
    provider: 'Deepseek AI',
    tier: 'heavy',
    avatar: 'https://avatars.githubusercontent.com/u/128254862',
    contextWindow: 32000,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.GEMINI.PRO_15]: {
    name: 'Gemini 1.5 Pro',
    description: 'Googleの高性能AIモデル',
    provider: 'Google',
    tier: 'heavy',
    avatar: null,
    contextWindow: 1000000,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.CLAUDE.SONNET_37]: {
    name: 'Claude 3.7 Sonnet',
    description: 'Anthropicの高性能AIモデル',
    provider: 'Anthropic',
    tier: 'heavy',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_logo.svg/1200px-Claude_logo.svg.png',
    contextWindow: 200000,
    japaneseSupport: true,
  },
  
  [MODELS.LOCAL.QWEN]: {
    name: 'Qwen3 4B',
    description: 'ローカルで動作する軽量AIモデル',
    provider: 'Alibaba',
    tier: 'free',
    avatar: 'https://qianwen-res.oss-cn-beijing.aliyuncs.com/logo_qwen.png',
    contextWindow: 8000,
    japaneseSupport: true,
    isLocal: true,
  },
  
  [MODELS.IMAGE.DALLE3]: {
    name: 'DALL-E 3',
    description: 'OpenAIの高性能画像生成モデル',
    provider: 'OpenAI',
    tier: 'free',
    avatar: null,
    japaneseSupport: true,
  },
  [MODELS.IMAGE.SDXL]: {
    name: 'Stable Diffusion XL',
    description: 'Stabilityの高性能画像生成モデル',
    provider: 'Stability AI',
    tier: 'free',
    avatar: null,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.CHATGPT]: {
    name: 'ChatGPT-4',
    provider: 'OpenAI',
    description: '最新のGPT-4モデル。高度な理解力と生成能力を持つAIです。',
    tier: 'lite',
    isPremium: true,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    contextWindow: 128000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.CLAUDE_LEGACY]: {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: '自然な会話と長文の理解に優れたAIアシスタント。',
    tier: 'heavy',
    isPremium: true,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_logo.svg/1200px-Claude_logo.svg.png',
    contextWindow: 200000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.DEEPSEEK_LEGACY]: {
    name: 'Deepseek',
    provider: 'Deepseek AI',
    description: '高度な知識と推論能力を持つ最新のAIモデル。',
    tier: 'free',
    isPremium: false,
    avatar: 'https://avatars.githubusercontent.com/u/128254862',
    contextWindow: 32000,
    japaneseSupport: true,
  },
};

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  LITE: 'lite',
  HEAVY: 'heavy',
};

export const USAGE_LIMITS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    [MODELS.CLOUD.GPT.MINI_4O]: 20,
    [MODELS.CLOUD.GPT.MINI_41]: 20,
    [MODELS.CLOUD.GPT.NANO_41]: 30,
    [MODELS.CLOUD.DEEPSEEK.R1]: 30,
    [MODELS.IMAGE.DALLE3]: 5,
    [MODELS.IMAGE.SDXL]: 10,
    [MODELS.LOCAL.QWEN]: -1, // -1 means unlimited with optional download
    [MODELS.CLOUD.CHATGPT]: 10,
    [MODELS.CLOUD.CLAUDE_LEGACY]: 5,
    [MODELS.CLOUD.DEEPSEEK_LEGACY]: 15,
  },
  [SUBSCRIPTION_PLANS.LITE]: {
    [MODELS.CLOUD.GPT.MINI_4O]: 50,
    [MODELS.CLOUD.GPT.MINI_41]: 50,
    [MODELS.CLOUD.GPT.NANO_41]: 100,
    [MODELS.CLOUD.GPT.GPT_4O]: 30,
    [MODELS.CLOUD.GPT.GPT_41]: 30,
    [MODELS.CLOUD.DEEPSEEK.R1]: 100,
    [MODELS.IMAGE.DALLE3]: 20,
    [MODELS.IMAGE.SDXL]: 40,
    [MODELS.LOCAL.QWEN]: -1, // Unlimited
    [MODELS.CLOUD.CHATGPT]: 30,
    [MODELS.CLOUD.CLAUDE_LEGACY]: 15,
    [MODELS.CLOUD.DEEPSEEK_LEGACY]: 50,
  },
  [SUBSCRIPTION_PLANS.HEAVY]: {
    [MODELS.CLOUD.GPT.MINI_4O]: 200,
    [MODELS.CLOUD.GPT.MINI_41]: 200,
    [MODELS.CLOUD.GPT.NANO_41]: 300,
    [MODELS.CLOUD.GPT.GPT_4O]: 100,
    [MODELS.CLOUD.GPT.GPT_41]: 100,
    [MODELS.CLOUD.GPT.GPT_45]: 50,
    [MODELS.CLOUD.DEEPSEEK.R1]: 300,
    [MODELS.CLOUD.DEEPSEEK.V3]: 100,
    [MODELS.CLOUD.GEMINI.PRO_15]: 50,
    [MODELS.CLOUD.CLAUDE.SONNET_37]: 50,
    [MODELS.IMAGE.DALLE3]: 50,
    [MODELS.IMAGE.SDXL]: 100,
    [MODELS.LOCAL.QWEN]: -1, // Unlimited
    [MODELS.CLOUD.CHATGPT]: 100,
    [MODELS.CLOUD.CLAUDE_LEGACY]: 50,
    [MODELS.CLOUD.DEEPSEEK_LEGACY]: 200,
  },
};

export const MODEL_FALLBACKS = {
  [MODELS.CLOUD.GPT.GPT_45]: MODELS.CLOUD.GPT.GPT_41,
  [MODELS.CLOUD.GPT.GPT_41]: MODELS.CLOUD.GPT.GPT_4O,
  [MODELS.CLOUD.GPT.GPT_4O]: MODELS.CLOUD.GPT.MINI_4O,
  [MODELS.CLOUD.GPT.MINI_4O]: MODELS.CLOUD.GPT.MINI_41,
  [MODELS.CLOUD.GPT.MINI_41]: MODELS.CLOUD.GPT.NANO_41,
  [MODELS.CLOUD.GPT.NANO_41]: MODELS.CLOUD.DEEPSEEK.R1,
  [MODELS.CLOUD.DEEPSEEK.V3]: MODELS.CLOUD.DEEPSEEK.R1,
  [MODELS.CLOUD.GEMINI.PRO_15]: MODELS.CLOUD.GPT.GPT_4O,
  [MODELS.CLOUD.CLAUDE.SONNET_37]: MODELS.CLOUD.GPT.GPT_4O,
  [MODELS.CLOUD.DEEPSEEK.R1]: MODELS.LOCAL.QWEN,
  [MODELS.CLOUD.CHATGPT]: MODELS.CLOUD.GPT.MINI_4O,
  [MODELS.CLOUD.CLAUDE_LEGACY]: MODELS.CLOUD.GPT.GPT_4O,
  [MODELS.CLOUD.DEEPSEEK_LEGACY]: MODELS.CLOUD.DEEPSEEK.R1,
};

export const PLAN_PRICING = {
  [SUBSCRIPTION_PLANS.FREE]: 0,
  [SUBSCRIPTION_PLANS.LITE]: 980,
  [SUBSCRIPTION_PLANS.HEAVY]: 2980,
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
export const setOpenRouterApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const apiKeys = await getApiKeys() || {};
    apiKeys.openRouter = apiKey;
    
    const { saveApiKeys } = await import('./secureStorage');
    await saveApiKeys(apiKeys);
    return true;
  } catch (error) {
    console.error('Error storing OpenRouter API key:', error);
    return false;
  }
};

export const getAvailableModels = (plan: string): string[] => {
  const availableModels: string[] = [];
  
  Object.entries(MODEL_INFO).forEach(([modelId, info]) => {
    if (plan === SUBSCRIPTION_PLANS.FREE && info.tier === SUBSCRIPTION_PLANS.FREE) {
      availableModels.push(modelId);
    } else if (plan === SUBSCRIPTION_PLANS.LITE && 
              (info.tier === SUBSCRIPTION_PLANS.FREE || info.tier === SUBSCRIPTION_PLANS.LITE)) {
      availableModels.push(modelId);
    } else if (plan === SUBSCRIPTION_PLANS.HEAVY) {
      availableModels.push(modelId);
    }
  });
  
  return availableModels;
};

export const getFallbackModel = (modelId: string): string | null => {
  return MODEL_FALLBACKS[modelId] || null;
};
