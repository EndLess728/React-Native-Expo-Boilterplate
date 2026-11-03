import React from 'react';
import { Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import { useCurrentUser, useLogout } from '@/features/auth';
import { usePosts } from '@/features/posts';
import { useTranslate } from '@/localization/utils';
import Button from '@/shared/components/Button';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { ms } from '@/shared/utils';
import { TextStyles } from '@/theme';

export function HomeScreen() {
  const { theme } = useUnistyles();
  const user = useCurrentUser();
  const logout = useLogout();
  const translate = useTranslate();

  const { data } = usePosts();

  if (__DEV__) {
    console.log('🚀 ~ Home ~ data ===> ', data);
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Ionicons
        color={theme.colors.primary}
        name="home-outline"
        size={ms(48)}
        style={styles.icon}
      />
      <Text style={TextStyles.h1}>
        {translate('auth.welcome')} {user?.email}
      </Text>
      <Button style={styles.btnStyle} title={translate('auth.logout')} onPress={logout} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(() => ({
  container: {
    padding: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: ms(16),
  },
  btnStyle: {
    marginTop: ms(40),
  },
}));
