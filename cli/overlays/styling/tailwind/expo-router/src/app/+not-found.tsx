import React from 'react';
import { Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';

import { useTranslate } from '@/localization/utils';
import ScreenWrapper from '@/shared/components/ScreenWrapper';

export default function NotFound() {
  const t = useTranslate();

  return (
    <>
      <Stack.Screen options={{ title: t('not_found.title') }} />
      <ScreenWrapper className="items-center justify-center p-5">
        <Text className="text-h1 font-opensans-bold text-typography">{t('not_found.message')}</Text>
        <View className="mt-5">
          <Link href="/">
            <Text className="text-body font-opensans-semibold text-primary underline">
              {t('not_found.go_home')}
            </Text>
          </Link>
        </View>
      </ScreenWrapper>
    </>
  );
}
