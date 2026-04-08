import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import type { Language } from '@/localization/resources';
import { useSelectedLanguage, useTranslate } from '@/localization/utils';
import { useUserStore } from '@/store/useUserStore';
import { fonts } from '@/theme';
import { ms } from '@/utils';

const LANGUAGES: {
  code: Language;
  labelKey: 'settings.english' | 'settings.spanish' | 'settings.arabic';
}[] = [
  { code: 'en', labelKey: 'settings.english' },
  { code: 'es', labelKey: 'settings.spanish' },
  { code: 'ar', labelKey: 'settings.arabic' },
];

const Profile: React.FC = () => {
  const logout = useUserStore((state) => state.logout);
  const { language, setLanguage } = useSelectedLanguage();
  const translate = useTranslate();

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>{translate('auth.profile')}</Text>

      {/* Language Picker Section */}
      <View style={styles.languageSection}>
        <Text style={styles.languageLabel}>{translate('settings.language')}</Text>
        <View style={styles.languageOptions}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              style={[styles.languageButton, language === lang.code && styles.languageButtonActive]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === lang.code && styles.languageButtonTextActive,
                ]}
              >
                {translate(lang.labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Button style={styles.btnStyle} title={translate('auth.logout')} onPress={logout} />
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.openSan.bold,
    fontSize: ms(30),
  },
  languageSection: {
    marginTop: ms(30),
    width: '100%',
    alignItems: 'center',
  },
  languageLabel: {
    fontFamily: fonts.openSan.semiBold,
    fontSize: ms(18),
    marginBottom: ms(15),
    color: theme.colors.typography,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: ms(10),
  },
  languageButton: {
    paddingVertical: ms(10),
    paddingHorizontal: ms(20),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: theme.colors.grey,
    backgroundColor: theme.colors.white,
  },
  languageButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageButtonText: {
    fontFamily: fonts.openSan.semiBold,
    fontSize: ms(14),
    color: theme.colors.black,
  },
  languageButtonTextActive: {
    color: theme.colors.white,
  },
  btnStyle: {
    marginTop: ms(40),
  },
}));
