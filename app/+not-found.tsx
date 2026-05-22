import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Link, Stack } from 'expo-router';

import ScreenWrapper from '@/components/ScreenWrapper';
import { fonts, TextStyles } from '@/theme';
import { ms } from '@/utils';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ScreenWrapper style={styles.container}>
        <Text style={TextStyles.h1}>This screen doesn&apos;t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
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
    fontFamily: fonts.openSan.semiBold,
    fontSize: ms(16),
  },
}));
