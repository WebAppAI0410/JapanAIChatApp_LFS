import Constants from 'expo-constants';

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
    tier: 'free',
    avatar: null,
    contextWindow: 16000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.MINI_41]: {
    name: 'GPT-4.1 Mini',
    description: '小型で高速なGPT-4.1モデル',
    tier: 'free',
    avatar: null,
    contextWindow: 16000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.NANO_41]: {
    name: 'GPT-4.1 Nano',
    description: '超小型で高速なGPT-4.1モデル',
    tier: 'free',
    avatar: null,
    contextWindow: 8000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.GPT_4O]: {
    name: 'GPT-4o',
    description: '高性能なGPT-4oモデル',
    tier: 'lite',
    avatar: null,
    contextWindow: 128000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.GPT_41]: {
    name: 'GPT-4.1',
    description: '高性能なGPT-4.1モデル',
    tier: 'lite',
    avatar: null,
    contextWindow: 128000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.GPT.GPT_45]: {
    name: 'GPT-4.5',
    description: '最新の高性能GPTモデル',
    tier: 'heavy',
    avatar: null,
    contextWindow: 128000,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.DEEPSEEK.R1]: {
    name: 'DeepSeek R1',
    description: '高性能な中国製AIモデル',
    tier: 'free',
    avatar: null,
    contextWindow: 32000,
    japaneseSupport: true,
  },
  [MODELS.CLOUD.DEEPSEEK.V3]: {
    name: 'DeepSeek V3',
    description: '最新の高性能中国製AIモデル',
    tier: 'heavy',
    avatar: null,
    contextWindow: 32000,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.GEMINI.PRO_15]: {
    name: 'Gemini 1.5 Pro',
    description: 'Googleの高性能AIモデル',
    tier: 'heavy',
    avatar: null,
    contextWindow: 1000000,
    japaneseSupport: true,
  },
  
  [MODELS.CLOUD.CLAUDE.SONNET_37]: {
    name: 'Claude 3.7 Sonnet',
    description: 'Anthropicの高性能AIモデル',
    tier: 'heavy',
    avatar: null,
    contextWindow: 200000,
    japaneseSupport: true,
  },
  
  [MODELS.LOCAL.QWEN]: {
    name: 'Qwen3 4B',
    description: 'ローカルで動作する軽量AIモデル',
    tier: 'free',
    avatar: null,
    contextWindow: 8000,
    japaneseSupport: true,
    isLocal: true,
  },
  
  [MODELS.IMAGE.DALLE3]: {
    name: 'DALL-E 3',
    description: 'OpenAIの高性能画像生成モデル',
    tier: 'free',
    avatar: null,
    japaneseSupport: true,
  },
  [MODELS.IMAGE.SDXL]: {
    name: 'Stable Diffusion XL',
    description: 'Stabilityの高性能画像生成モデル',
    tier: 'free',
    avatar: null,
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
};

export const PLAN_PRICING = {
  [SUBSCRIPTION_PLANS.FREE]: 0,
  [SUBSCRIPTION_PLANS.LITE]: 980,
  [SUBSCRIPTION_PLANS.HEAVY]: 2980,
};

export const getOpenRouterApiKey = async (): Promise<string | null> => {
  try {
    const { getSecureItem } = await import('./secureStorage');
    return await getSecureItem('openrouter_api_key');
  } catch (error) {
    console.error('Error retrieving OpenRouter API key:', error);
    return null;
  }
};

export const setOpenRouterApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const { setSecureItem } = await import('./secureStorage');
    await setSecureItem('openrouter_api_key', apiKey);
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
