import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import type { Language } from '@/localization/resources';
import { useSelectedLanguage, useTranslate } from '@/localization/utils';
import { useUserStore } from '@/store/useUserStore';
import { TextStyles } from '@/theme';
import { ms } from '@/utils';

const LANGUAGES: {
  code: Language;
  labelKey: 'settings.english' | 'settings.spanish' | 'settings.arabic';
}[] = [
  { code: 'en', labelKey: 'settings.english' },
  { code: 'es', labelKey: 'settings.spanish' },
  { code: 'ar', labelKey: 'settings.arabic' },
];

export default function ProfileScreen() {
  const logout = useUserStore((state) => state.logout);
  const { language, setLanguage } = useSelectedLanguage();
  const translate = useTranslate();

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={TextStyles.h1}>{translate('auth.profile')}</Text>

      <View style={styles.languageSection}>
        <Text style={[TextStyles.bodyLargeSemiBold, styles.languageLabel]}>
          {translate('settings.language')}
        </Text>
        <View style={styles.languageOptions}>
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <Pressable
                key={lang.code}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={[styles.languageButton, isActive && styles.languageButtonActive]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text
                  style={[
                    TextStyles.bodySmallSemiBold,
                    isActive ? styles.languageButtonTextActive : styles.languageButtonText,
                  ]}
                >
                  {translate(lang.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Button style={styles.btnStyle} title={translate('auth.logout')} onPress={logout} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSection: {
    marginTop: ms(30),
    width: '100%',
    alignItems: 'center',
  },
  languageLabel: {
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
    borderColor: theme.colors.borderGray,
    backgroundColor: theme.colors.surface,
  },
  languageButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageButtonText: {
    color: theme.colors.typography,
  },
  languageButtonTextActive: {
    color: theme.colors.onPrimary,
  },
  btnStyle: {
    marginTop: ms(40),
  },
}));
