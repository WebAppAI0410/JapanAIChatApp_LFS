import Constants from 'expo-constants';
import { ChatMessage } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const OPENROUTER_API_KEY = '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';

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

const FREE_TIER_LIMITS = {
  [MODELS.CLOUD.CHATGPT]: 10,
  [MODELS.CLOUD.CLAUDE]: 5,
  [MODELS.CLOUD.DEEPSEEK]: 15
};

export const sendMessageToOpenRouter = async (
  messages: ChatMessage[],
  model: string,
  maxTokens: number = 1000
): Promise<ChatMessage> => {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer \${OPENROUTER_API_KEY}`,
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
      throw new Error(`OpenRouter API error: \${errorData.error?.message || response.statusText}`);
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
  return true;
};
