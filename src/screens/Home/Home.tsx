import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { usePosts } from '@/api/posts/use-posts';
import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useTranslate } from '@/localization/utils';
import { useUserStore } from '@/store/useUserStore';
import { TextStyles } from '@/theme';
import { ms } from '@/utils';

const Home: React.FC = () => {
  // Atomic selectors — each subscription is scoped to a single store field,
  // so unrelated store updates don't re-render Home.
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const translate = useTranslate();

  const { data } = usePosts();

  if (__DEV__) {
    console.log('🚀 ~ Home ~ data ===> ', data);
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={TextStyles.h1}>
        {translate('auth.welcome')} {user?.email}
      </Text>
      <Button style={styles.btnStyle} title="Logout" onPress={logout} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create(() => ({
  container: {
    padding: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    marginTop: ms(40),
  },
}));
