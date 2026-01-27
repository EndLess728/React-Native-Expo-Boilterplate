import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, ScreenWrapper } from '@/components';
import { translate } from '@/localization/utils';
import { useUserStore } from '@/store';
import { fonts } from '@/theme';
import { ms } from '@/utils';

const Profile: React.FC = () => {
  const logout = useUserStore((state) => state.logout);

  const onPressLogout = () => {
    logout();
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>{translate('auth.profile')}</Text>
      <Button style={styles.btnStyle} title="Logout" onPress={onPressLogout} />
    </ScreenWrapper>
  );
};

export default Profile;

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
