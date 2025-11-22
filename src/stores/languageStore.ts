// src/stores/languageStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/i18n';

export type Language = 'zh' | 'en';

interface LanguageState {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh',
      changeLanguage: async (lang: Language) => {
        try {
          await i18n.changeLanguage(lang);
          set({ currentLanguage: lang });
        } catch (error) {
          console.error('Failed to change language:', error);
        }
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);