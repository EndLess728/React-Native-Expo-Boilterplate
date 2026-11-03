import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import { useLogout } from '@/features/auth';
import type { Language } from '@/localization/resources';
import { useSelectedLanguage, useTranslate } from '@/localization/utils';
import Button from '@/shared/components/Button';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { useAppTheme } from '@/theme';

const LANGUAGES: {
  code: Language;
  label: string;
}[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
];

export function ProfileScreen() {
  const theme = useAppTheme();
  const logout = useLogout();
  const { language, setLanguage } = useSelectedLanguage();
  const translate = useTranslate();

  return (
    <ScreenWrapper className="items-center justify-center p-5">
      <View className="mb-4">
        <Ionicons color={theme.colors.primary} name="person-outline" size={48} />
      </View>
      <Text className="text-h1 font-opensans-bold text-typography">{translate('auth.profile')}</Text>

      <View className="mt-[30px] w-full items-center">
        <Text className="mb-[15px] text-body-lg font-opensans-semibold text-typography">
          {translate('settings.language')}
        </Text>
        <View className="flex-row gap-2.5">
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <Pressable
                key={lang.code}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                className={`rounded-lg border px-5 py-2.5 ${
                  isActive ? 'border-primary bg-primary' : 'border-border-gray bg-surface'
                }`}
                onPress={() => setLanguage(lang.code)}
              >
                <Text
                  className={`text-body-sm font-opensans-semibold ${
                    isActive ? 'text-on-primary' : 'text-typography'
                  }`}
                >
                  {lang.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Button className="mt-10" title={translate('auth.logout')} onPress={logout} />
    </ScreenWrapper>
  );
}
