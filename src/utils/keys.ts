export interface ApiKeys {
  openai: string;
  claude: string;
  deepseek: string;
}

const KEYS_STORAGE_KEY = 'resume-lab-api-keys';

const DEFAULT_KEYS: ApiKeys = {
  openai: '',
  claude: '',
  deepseek: ''
};

export function getApiKeys(): ApiKeys {
  try {
    const jsonString = localStorage.getItem(KEYS_STORAGE_KEY);
    if (!jsonString) return { ...DEFAULT_KEYS };
    
    const keys = JSON.parse(jsonString) as Partial<ApiKeys>;
    return {
      openai: keys.openai || '',
      claude: keys.claude || '',
      deepseek: keys.deepseek || ''
    };
  } catch (error) {
    console.error('Error loading API keys from localStorage:', error);
    return { ...DEFAULT_KEYS };
  }
}

export function saveApiKeys(keys: ApiKeys): void {
  try {
    const jsonString = JSON.stringify(keys);
    localStorage.setItem(KEYS_STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('Error saving API keys to localStorage:', error);
    throw error;
  }
}

export function clearApiKeys(): void {
  try {
    localStorage.removeItem(KEYS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing API keys from localStorage:', error);
  }
}
