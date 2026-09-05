import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../data/locales/en.json';
import id from '../data/locales/id.json';

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem('portfolio-language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('portfolio-language', lng);
});

export default i18n;
