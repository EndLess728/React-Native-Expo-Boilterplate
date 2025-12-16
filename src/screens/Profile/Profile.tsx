import React from 'react';
import { Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useDispatch } from 'react-redux';

import { Button, ScreenWrapper } from '@/components';
import { logout } from '@/redux/actions/authAction';
import { fonts } from '@/theme';
import { ms } from '@/utils';

const Profile: React.FC = () => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const onPressLogout = () => {
    dispatch(logout());
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Profile</Text>
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
