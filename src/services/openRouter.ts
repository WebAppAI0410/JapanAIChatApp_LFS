import { ChatMessage } from '../types';
import { 
  API_URLS, 
  MODELS, 
  MODEL_INFO, 
  MODEL_FALLBACKS,
  SUBSCRIPTION_PLANS,
  USAGE_LIMITS,
  getOpenRouterApiKey
} from './apiConfig';
import { 
  getUserProfile, 
  checkUsageLimit, 
  incrementModelUsage 
} from './secureStorage';
import { v4 as uuidv4 } from 'uuid';

export { MODELS, MODEL_INFO, MODEL_FALLBACKS, SUBSCRIPTION_PLANS, USAGE_LIMITS };

export const sendMessageToOpenRouter = async (
  messages: ChatMessage[],
  model: string,
  maxTokens: number = 1000
): Promise<ChatMessage> => {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      throw new Error('User profile not found. Please restart the app.');
    }

    const modelInfo = MODEL_INFO[model];
    if (!modelInfo) {
      throw new Error(`Model ${model} is not supported.`);
    }

    const planAllowsModel = 
      (userProfile.plan === SUBSCRIPTION_PLANS.FREE && modelInfo.tier === SUBSCRIPTION_PLANS.FREE) ||
      (userProfile.plan === SUBSCRIPTION_PLANS.LITE && 
        (modelInfo.tier === SUBSCRIPTION_PLANS.FREE || modelInfo.tier === SUBSCRIPTION_PLANS.LITE)) ||
      (userProfile.plan === SUBSCRIPTION_PLANS.HEAVY);

    if (!planAllowsModel) {
      throw new Error(`このモデルはお使いのプランではご利用いただけません。アップグレードをご検討ください。`);
    }

    const withinLimits = await checkUsageLimit(model, userProfile.plan);
    if (!withinLimits) {
      const fallbackModel = MODEL_FALLBACKS[model];
      if (fallbackModel) {
        console.log(`Usage limit reached for ${model}, falling back to ${fallbackModel}`);
        return sendMessageToOpenRouter(messages, fallbackModel, maxTokens);
      } else {
        throw new Error(`本日の${MODEL_INFO[model].name}の利用回数上限に達しました。明日再度お試しいただくか、別のモデルをお試しください。`);
      }
    }

    if (model === MODELS.LOCAL.QWEN) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      return {
        id: uuidv4(),
        role: 'assistant',
        content: 'これはQwen3:4Bローカルモデルからのテスト応答です。実際の実装では、WebLLMを使用してローカル推論を行います。',
        model,
        timestamp: Date.now()
      };
    }

    // Get API key securely
    const apiKey = await getOpenRouterApiKey();
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not found. Please set it in the settings.');
    }
    
    const response = await fetch(API_URLS.OPENROUTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://japanaichatapp.com',
        'X-Title': 'Japan AI Chat App'
      },
      body: JSON.stringify({
        model,
        messages: messages.map(({ role, content }) => ({ role, content })),
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    await incrementModelUsage(model);

    return {
      id: uuidv4(),
      role: 'assistant',
      content: data.choices[0].message.content,
      model,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    throw error;
  }
};

export const checkModelAvailability = async (model: string): Promise<{
  available: boolean;
  reason?: string;
  fallbackModel?: string;
}> => {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      return { 
        available: false, 
        reason: 'User profile not found. Please restart the app.' 
      };
    }

    const modelInfo = MODEL_INFO[model];
    if (!modelInfo) {
      return { 
        available: false, 
        reason: `Model ${model} is not supported.` 
      };
    }

    const planAllowsModel = 
      (userProfile.plan === SUBSCRIPTION_PLANS.FREE && modelInfo.tier === SUBSCRIPTION_PLANS.FREE) ||
      (userProfile.plan === SUBSCRIPTION_PLANS.LITE && 
        (modelInfo.tier === SUBSCRIPTION_PLANS.FREE || modelInfo.tier === SUBSCRIPTION_PLANS.LITE)) ||
      (userProfile.plan === SUBSCRIPTION_PLANS.HEAVY);

    if (!planAllowsModel) {
      return { 
        available: false, 
        reason: `このモデルはお使いのプランではご利用いただけません。アップグレードをご検討ください。`,
        fallbackModel: MODEL_FALLBACKS[model] 
      };
    }

    const withinLimits = await checkUsageLimit(model, userProfile.plan);
    if (!withinLimits) {
      return { 
        available: false, 
        reason: `本日の${MODEL_INFO[model].name}の利用回数上限に達しました。明日再度お試しいただくか、別のモデルをお試しください。`,
        fallbackModel: MODEL_FALLBACKS[model]
      };
    }

    return { available: true };
  } catch (error) {
    console.error('Error checking model availability:', error);
    return { 
      available: false, 
      reason: 'エラーが発生しました。もう一度お試しください。' 
    };
  }
};

export const getAvailableModelsForUser = async (): Promise<string[]> => {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      return [];
    }

    const { getAvailableModels } = await import('./apiConfig');
    return getAvailableModels(userProfile.plan);
  } catch (error) {
    console.error('Error getting available models:', error);
    return [];
  }
};
