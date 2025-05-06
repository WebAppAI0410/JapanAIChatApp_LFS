import { 
  API_URLS, 
  MODELS, 
  MODEL_INFO, 
  SUBSCRIPTION_PLANS 
} from './apiConfig';
import { 
  getSecureItem, 
  getUserProfile, 
  checkUsageLimit, 
  incrementModelUsage 
} from './secureStorage';
import { v4 as uuidv4 } from 'uuid';

export interface ImageGenerationOptions {
  prompt: string;
  model: string;
  size?: string;
  quality?: 'standard' | 'hd';
  style?: string;
  n?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  model: string;
  prompt: string;
  timestamp: number;
}

export const generateImage = async (
  options: ImageGenerationOptions
): Promise<GeneratedImage> => {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      throw new Error('User profile not found. Please restart the app.');
    }

    const modelInfo = MODEL_INFO[options.model];
    if (!modelInfo) {
      throw new Error(`Model ${options.model} is not supported.`);
    }

    const planAllowsModel = 
      (userProfile.plan === SUBSCRIPTION_PLANS.FREE && modelInfo.tier === SUBSCRIPTION_PLANS.FREE) ||
      (userProfile.plan === SUBSCRIPTION_PLANS.LITE && 
        (modelInfo.tier === SUBSCRIPTION_PLANS.FREE || modelInfo.tier === SUBSCRIPTION_PLANS.LITE)) ||
      (userProfile.plan === SUBSCRIPTION_PLANS.HEAVY);

    if (!planAllowsModel) {
      throw new Error(`このモデルはお使いのプランではご利用いただけません。アップグレードをご検討ください。`);
    }

    const withinLimits = await checkUsageLimit(options.model, userProfile.plan);
    if (!withinLimits) {
      throw new Error(`本日の${MODEL_INFO[options.model].name}の利用回数上限に達しました。明日再度お試しいただくか、別のモデルをお試しください。`);
    }

    const apiKey = await getSecureItem('openrouter_api_key');
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not found. Please set it in the settings.');
    }
    
    const size = options.size || '1024x1024';
    const n = options.n || 1;
    const quality = options.quality || 'standard';
    
    let requestBody: any = {
      model: options.model,
      prompt: options.prompt,
    };
    
    if (options.model === MODELS.IMAGE.DALLE3) {
      requestBody = {
        ...requestBody,
        size,
        quality,
        n,
      };
    } else if (options.model === MODELS.IMAGE.SDXL) {
      requestBody = {
        ...requestBody,
        size,
        n,
      };
      
      if (options.style) {
        requestBody.style = options.style;
      }
    }
    
    const response = await fetch(API_URLS.IMAGE_GENERATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://japanaichatapp.com',
        'X-Title': 'Japan AI Chat App'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Image generation error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    await incrementModelUsage(options.model);
    
    const imageUrl = data.data[0].url;
    
    return {
      id: uuidv4(),
      url: imageUrl,
      model: options.model,
      prompt: options.prompt,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const getAvailableImageModels = async (): Promise<string[]> => {
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      return [];
    }
    
    const availableModels: string[] = [];
    
    if (userProfile.plan === SUBSCRIPTION_PLANS.FREE) {
      if (MODEL_INFO[MODELS.IMAGE.DALLE3].tier === SUBSCRIPTION_PLANS.FREE) {
        availableModels.push(MODELS.IMAGE.DALLE3);
      }
      if (MODEL_INFO[MODELS.IMAGE.SDXL].tier === SUBSCRIPTION_PLANS.FREE) {
        availableModels.push(MODELS.IMAGE.SDXL);
      }
    } else if (userProfile.plan === SUBSCRIPTION_PLANS.LITE) {
      if (MODEL_INFO[MODELS.IMAGE.DALLE3].tier === SUBSCRIPTION_PLANS.FREE || 
          MODEL_INFO[MODELS.IMAGE.DALLE3].tier === SUBSCRIPTION_PLANS.LITE) {
        availableModels.push(MODELS.IMAGE.DALLE3);
      }
      if (MODEL_INFO[MODELS.IMAGE.SDXL].tier === SUBSCRIPTION_PLANS.FREE || 
          MODEL_INFO[MODELS.IMAGE.SDXL].tier === SUBSCRIPTION_PLANS.LITE) {
        availableModels.push(MODELS.IMAGE.SDXL);
      }
    } else if (userProfile.plan === SUBSCRIPTION_PLANS.HEAVY) {
      availableModels.push(MODELS.IMAGE.DALLE3);
      availableModels.push(MODELS.IMAGE.SDXL);
    }
    
    return availableModels;
  } catch (error) {
    console.error('Error getting available image models:', error);
    return [];
  }
};

export const checkImageGenerationAvailability = async (model: string): Promise<{
  available: boolean;
  reason?: string;
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
        reason: `このモデルはお使いのプランではご利用いただけません。アップグレードをご検討ください。`
      };
    }

    const withinLimits = await checkUsageLimit(model, userProfile.plan);
    if (!withinLimits) {
      return { 
        available: false, 
        reason: `本日の${MODEL_INFO[model].name}の利用回数上限に達しました。明日再度お試しいただくか、別のモデルをお試しください。`
      };
    }

    return { available: true };
  } catch (error) {
    console.error('Error checking image generation availability:', error);
    return { 
      available: false, 
      reason: 'エラーが発生しました。もう一度お試しください。' 
    };
  }
};
