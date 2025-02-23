'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getItem, indexedDBService, setItem, removeItem } from '@/utils/indexedDB';

/** Represents the possible view types for document display */
export type ViewType = 'single' | 'dual' | 'scroll';

/** Configuration values for the application */
type ConfigValues = {
  apiKey: string;
  baseUrl: string;
  viewType: ViewType;
  voiceSpeed: number;
  voice: string;
  skipBlank: boolean;
  epubTheme: boolean;
};

/** Interface defining the configuration context shape and functionality */
interface ConfigContextType {
  apiKey: string;
  baseUrl: string;
  viewType: ViewType;
  voiceSpeed: number;
  voice: string;
  skipBlank: boolean;
  epubTheme: boolean;
  updateConfig: (newConfig: Partial<{ apiKey: string; baseUrl: string; viewType: ViewType }>) => Promise<void>;
  updateConfigKey: <K extends keyof ConfigValues>(key: K, value: ConfigValues[K]) => Promise<void>;
  isLoading: boolean;
  isDBReady: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * Provider component for application configuration
 * Manages global configuration state and persistence
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 */
export function ConfigProvider({ children }: { children: ReactNode }) {
  // Config state
  const [apiKey, setApiKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [viewType, setViewType] = useState<ViewType>('single');
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1);
  const [voice, setVoice] = useState<string>('af_sarah');
  const [skipBlank, setSkipBlank] = useState<boolean>(true);
  const [epubTheme, setEpubTheme] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        setIsLoading(true);
        await indexedDBService.init();
        setIsDBReady(true);
        
        // Load config from IndexedDB
        const cachedApiKey = await getItem('apiKey');
        const cachedBaseUrl = await getItem('baseUrl');
        const cachedViewType = await getItem('viewType');
        const cachedVoiceSpeed = await getItem('voiceSpeed');
        const cachedVoice = await getItem('voice');
        const cachedSkipBlank = await getItem('skipBlank');
        const cachedEpubTheme = await getItem('epubTheme');

        // Only set API key and base URL if they were explicitly saved by the user
        if (cachedApiKey) {
          console.log('Using cached API key');
          setApiKey(cachedApiKey);
        }
        if (cachedBaseUrl) {
          console.log('Using cached base URL');
          setBaseUrl(cachedBaseUrl);
        }

        // Set the other values with defaults
        setViewType((cachedViewType || 'single') as ViewType);
        setVoiceSpeed(parseFloat(cachedVoiceSpeed || '1'));
        setVoice(cachedVoice || 'af_sarah');
        setSkipBlank(cachedSkipBlank === 'false' ? false : true);
        setEpubTheme(cachedEpubTheme === 'true');

        // Only save non-sensitive settings by default
        if (!cachedViewType) {
          await setItem('viewType', 'single');
        }
        if (cachedSkipBlank === null) {
          await setItem('skipBlank', 'true');
        }
        if (cachedEpubTheme === null) {
          await setItem('epubTheme', 'false');
        }
        
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  /**
   * Updates multiple configuration values simultaneously
   * Only saves API credentials if they are explicitly set
   */
  const updateConfig = async (newConfig: Partial<{ apiKey: string; baseUrl: string }>) => {
    try {
      if (newConfig.apiKey !== undefined || newConfig.apiKey !== '') {
        // Only save API key to IndexedDB if it's different from env default
        await setItem('apiKey', newConfig.apiKey!);
        setApiKey(newConfig.apiKey!);
      }
      if (newConfig.baseUrl !== undefined || newConfig.baseUrl !== '') {
        // Only save base URL to IndexedDB if it's different from env default
        await setItem('baseUrl', newConfig.baseUrl!);
        setBaseUrl(newConfig.baseUrl!);
      }

      // Delete completely if '' is passed
      if (newConfig.apiKey === '') {
        await removeItem('apiKey');
        setApiKey('');
      }
      if (newConfig.baseUrl === '') {
        await removeItem('baseUrl');
        setBaseUrl('');
      }
      
    } catch (error) {
      console.error('Error updating config:', error);
      throw error;
    }
  };

  /**
   * Updates a single configuration value by key
   * @param {K} key - The configuration key to update
   * @param {ConfigValues[K]} value - The new value for the configuration
   */
  const updateConfigKey = async <K extends keyof ConfigValues>(key: K, value: ConfigValues[K]) => {
    try {
      await setItem(key, value.toString());
      switch (key) {
        case 'apiKey':
          setApiKey(value as string);
          break;
        case 'baseUrl':
          setBaseUrl(value as string);
          break;
        case 'viewType':
          setViewType(value as ViewType);
          break;
        case 'voiceSpeed':
          setVoiceSpeed(value as number);
          break;
        case 'voice':
          setVoice(value as string);
          break;
        case 'skipBlank':
          setSkipBlank(value as boolean);
          break;
        case 'epubTheme':
          setEpubTheme(value as boolean);
          break;
      }
    } catch (error) {
      console.error(`Error updating config key ${key}:`, error);
      throw error;
    }
  };

  return (
    <ConfigContext.Provider value={{ 
      apiKey, 
      baseUrl, 
      viewType, 
      voiceSpeed,
      voice,
      skipBlank,
      epubTheme,
      updateConfig, 
      updateConfigKey,
      isLoading, 
      isDBReady 
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Custom hook to consume the configuration context
 * @returns {ConfigContextType} The configuration context value
 * @throws {Error} When used outside of ConfigProvider
 */
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}