import { ChatMessage } from '../types';
import { API_URLS, MODELS, getOpenRouterApiKey } from './apiConfig';

export { MODELS };

export const sendMessageToOpenRouter = async (
  messages: ChatMessage[],
  model: string,
  maxTokens: number = 1000
): Promise<ChatMessage> => {
  try {
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

    return {
      id: Date.now().toString(),
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

export const checkFreeTierLimit = async (userId: string, model: string): Promise<boolean> => {
  // This would be implemented with a proper backend check
  // For now, we'll return true to allow usage
  return true;
};
