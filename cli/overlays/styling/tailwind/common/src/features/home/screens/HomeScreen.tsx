import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import { useCurrentUser, useLogout } from '@/features/auth';
import { usePosts } from '@/features/posts';
import { useTranslate } from '@/localization/utils';
import Button from '@/shared/components/Button';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { useAppTheme } from '@/theme';

export function HomeScreen() {
  const theme = useAppTheme();
  const user = useCurrentUser();
  const logout = useLogout();
  const translate = useTranslate();

  const { data } = usePosts();

  if (__DEV__) {
    console.log('🚀 ~ Home ~ data ===> ', data);
  }

  return (
    <ScreenWrapper className="items-center justify-center p-5">
      <View className="mb-4">
        <Ionicons color={theme.colors.primary} name="home-outline" size={48} />
      </View>
      <Text className="text-h1 font-opensans-bold text-typography">
        {translate('auth.welcome')} {user?.email}
      </Text>
      <Button className="mt-10" title={translate('auth.logout')} onPress={logout} />
    </ScreenWrapper>
  );
}
