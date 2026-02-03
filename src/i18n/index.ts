import i18n from 'i18next';  // 核心库
import { initReactI18next } from 'react-i18next';  // React 绑定
import * as Localization from 'expo-localization';  // 获取设备语言
import AsyncStorage from '@react-native-async-storage/async-storage';  // 本地存储

import zh from './locales/zh';  // 中文翻译
import en from './locales/en';  // 英文翻译

const LANGUAGE_KEY = 'user-language';  // 存储语言的 key

// 【核心函数1】从本地存储读取用户上次选择的语言
const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);  // 读取本地存储
  } catch (error) {
    console.error('Error reading language:', error);
    return null;
  }
};

// 【核心函数2】获取设备语言(如果用户没选过)
const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales();  // 获取区域设置数组
  if (!locales || locales.length === 0) {
    return 'en'; // 默认英文
  }
  const languageCode = locales[0].languageCode;  // 例如: "zh" 或 "en"
  return languageCode === 'en' ? 'en' : 'zh';  // 默认English
};

// 【核心函数3】初始化 i18n
const initI18n = async () => {
  const storedLanguage = await getStoredLanguage();  // 先读本地存储
  const initialLanguage = storedLanguage || getDeviceLanguage();  // 本地没有就用设备语言

  i18n
    .use(initReactI18next)  // 绑定 React
    .init({  // 配置
      resources: {  // 翻译资源
        zh: { translation: zh },  // 中文
        en: { translation: en },  // 英文
      },
      lng: initialLanguage,  // 初始语言
      fallbackLng: 'zh',  // 如果翻译缺失,回退到中文
      interpolation: {
        escapeValue: false,  // React 已经防 XSS 了
      },
    });
};

initI18n();  // 立即执行初始化

export default i18n;