import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/app/locales/en.json';
import zh from '@/app/locales/zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: 'zh', // 默認語言
    fallbackLng: 'zh', // 回退語言
    interpolation: {
      escapeValue: false, // React 已經處理了轉義
    },
  });

export default i18n;
