import { useCallback } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import RNRestart from 'react-native-restart';
import { Language, translate, TxKeyPath, useTranslate } from '@repo/shared';
import i18n from 'i18next';

import { storage } from '../storage';

export { translate, useTranslate };
export type { TxKeyPath };

export const LOCAL = 'local';

export const getLanguage = () => storage.getString(LOCAL);

export const changeLanguage = (lang: Language) => {
  const currentLang = i18n.language;
  const isCurrentRTL = currentLang === 'ar';
  const isNewRTL = lang === 'ar';
  const needsRTLChange = isCurrentRTL !== isNewRTL;

  // Change i18next language (this triggers react-i18next to re-render)
  i18n.changeLanguage(lang);

  // Only reload if RTL direction needs to change
  if (needsRTLChange) {
    if (lang === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
    // RTL changes require app restart to take effect
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (__DEV__) NativeModules.DevSettings.reload();
      else RNRestart.restart();
    } else if (Platform.OS === 'web') {
      window.location.reload();
    }
  }
};

export const useSelectedLanguage = () => {
  const [language, setLang] = useMMKVString(LOCAL, storage);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      if (lang !== undefined) changeLanguage(lang as Language);
    },
    [setLang],
  );

  return { language: language as Language, setLanguage };
};
