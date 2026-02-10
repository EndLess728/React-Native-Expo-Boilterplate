import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import { resources } from './resources';
import { getLanguage } from './utils';

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage() || deviceLanguage, // Device language
  fallbackLng: 'en', // Fallback to "en" if translation missing
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  compatibilityJSON: 'v4', // For Android compatibility
});

// Is it a RTL language?
export const isRTL: boolean = i18n.dir() === 'rtl';

I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export default i18n;
