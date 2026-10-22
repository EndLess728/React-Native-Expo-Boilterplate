import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Link, Stack } from 'expo-router';

import { useTranslate } from '@/localization/utils';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { ms } from '@/shared/utils';
import { TextStyles } from '@/theme';

export default function NotFound() {
  const t = useTranslate();

  return (
    <>
      <Stack.Screen options={{ title: t('not_found.title') }} />
      <ScreenWrapper style={styles.container}>
        <Text style={TextStyles.h1}>{t('not_found.message')}</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={[TextStyles.link, styles.linkText]}>{t('not_found.go_home')}</Text>
        </Link>
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginTop: ms(20),
  },
  linkText: {
    color: theme.colors.primary,
  },
}));
