import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; //将expo-localization导入到i18n中
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en';
import zh from './locales/zh';

const LANGUAGE_KEY = 'user_language';

//Get the saved language
const getStoredLanguage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(LANGUAGE_KEY);
    } catch (error) {
        console.error('Error getting stored language:', error);
        return null;
    }
};

//Get the device language
const getDeviceLanguage = (): string => {
    const locale = Localization.getLocales()[0].languageCode;
    return locale === 'zh' ? 'zh' : 'en';
};

//init
const initI18n = async () => {
    const storedLanguage = await getStoredLanguage();   //获取存储的语言
    const initialLanguage = storedLanguage || getDeviceLanguage();  //如果存储的语言为空，则使用设备语言

    i18n  //i18n 初始化
        .use(initReactI18next)   //将initReactI18next插件添加到i18n中
        .init({
            resources: {
                en: {
                    translation: en,
                },
                zh: {
                    translation: zh,
                },
            },
            lng: initialLanguage,  //将初始语言设置为存储的语言或设备语言
            fallbackLng: 'zh',     //如果初始语言不是zh或en，则使用zh作为回退语言
            interpolation: {
                escapeValue: false,  //React 会自动转义插值值，以防止 XSS 攻击
            },
        });
}
initI18n();  //初始化i18n
export default i18n;  //导出i18n实例, 其他组件可以使用i18n.t('key')来获取翻译字符串