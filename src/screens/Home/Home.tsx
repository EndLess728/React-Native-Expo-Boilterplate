import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useDispatch, useSelector } from 'react-redux';

import { Button, ScreenWrapper } from '@/components';
import { logout } from '@/redux/actions/authAction';
import { fonts } from '@/theme';
import { ms } from '@/utils';

const Home: React.FC = () => {
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const onPressLogout = () => {
    dispatch(logout() as any);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Welcome {user?.email}</Text>
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
