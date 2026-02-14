import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { usePosts } from '@/api';
import { Button, ScreenWrapper } from '@/components';
import { useTranslate } from '@/localization/utils';
import { useUserStore } from '@/store';
import { fonts } from '@/theme';
import { ms } from '@/utils';

const Home: React.FC = () => {
  const { user, logout } = useUserStore();
  const translate = useTranslate();

  const { data } = usePosts();

  console.log('🚀 ~ Home ~ data ===> ', data);

  const onPressLogout = () => {
    logout();
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>
        {translate('auth.welcome')} {user?.email}
      </Text>
      <Button style={styles.btnStyle} title="Logout" onPress={onPressLogout} />
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
  title: {
    fontFamily: fonts.openSan.bold,
    fontSize: ms(30),
  },
  btnStyle: {
    marginTop: ms(40),
  },
}));
