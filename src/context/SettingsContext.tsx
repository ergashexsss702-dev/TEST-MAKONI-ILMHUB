import React, { createContext, useContext, useState, useEffect } from 'react';
import { BackgroundPreset, BackgroundIntensity, CustomBackgroundConfig, UserSettings } from '../types';
import { getTranslation, TranslationDict, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface SettingsContextType {
  settings: UserSettings;
  t: TranslationDict;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setPreset: (preset: BackgroundPreset) => void;
  setIntensity: (intensity: BackgroundIntensity) => void;
  setReduceMotion: (reduce: boolean) => void;
  setLanguage: (lang: string) => void;
  updateCustomBackground: (config: CustomBackgroundConfig) => void;
  handleFileUpload: (file: File) => Promise<{ success: boolean; error?: string }>;
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
}

const STORAGE_KEY_SETTINGS = 'ilmhub_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  backgroundPreset: 'galaxy',
  backgroundIntensity: 'medium',
  reduceMotion: false,
  language: 'uz',
  telegramNotifications: true,
  customBackground: {
    imageUrl: '',
    brightness: 100,
    blur: 0,
    opacity: 85,
    zoom: 100,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isTestActive, setIsTestActive] = useState<boolean>(false);

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Sync HTML class for dark/light mode & direction for RTL languages
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === settings.language);
    root.dir = currentLang?.dir || 'ltr';
    root.lang = settings.language;
  }, [settings.theme, settings.language]);

  const t = getTranslation(settings.language);

  const setTheme = (theme: 'dark' | 'light') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const setPreset = (backgroundPreset: BackgroundPreset) => {
    setSettings(prev => ({ ...prev, backgroundPreset }));
  };

  const setIntensity = (backgroundIntensity: BackgroundIntensity) => {
    setSettings(prev => ({ ...prev, backgroundIntensity }));
  };

  const setReduceMotion = (reduceMotion: boolean) => {
    setSettings(prev => ({ ...prev, reduceMotion }));
  };

  const setLanguage = (language: string) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const updateCustomBackground = (config: CustomBackgroundConfig) => {
    setSettings(prev => ({
      ...prev,
      backgroundPreset: 'custom',
      customBackground: config,
    }));
  };

  const handleFileUpload = (file: File): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Validate MIME type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        resolve({ success: false, error: 'Faqat JPG, PNG, WEBP formatidagi rasmlar qabul qilinadi.' });
        return;
      }

      // Max size: 6MB
      if (file.size > 6 * 1024 * 1024) {
        resolve({ success: false, error: 'Rasm hajmi 6MB dan oshmasligi kerak.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          updateCustomBackground({
            imageUrl: result,
            brightness: 100,
            blur: 2,
            opacity: 85,
            zoom: 100,
          });
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Faylni o‘qishda xatolik yuz berdi.' });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Faylni yuklashda xatolik yuz berdi.' });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        t,
        setTheme,
        toggleTheme,
        setPreset,
        setIntensity,
        setReduceMotion,
        setLanguage,
        updateCustomBackground,
        handleFileUpload,
        isTestActive,
        setIsTestActive,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
