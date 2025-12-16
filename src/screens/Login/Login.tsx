import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useDispatch } from 'react-redux';

import { Button, ScreenWrapper, TextField } from '@/components';
import { showErrorToast } from '@/components/ToastAlert';
import { login } from '@/redux/slices/userSlicer';
import { fonts } from '@/theme';
import { ms } from '@/utils';

const Login: React.FC = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const dispatch = useDispatch();

  const onPressLogin = () => {
    if (email.trim() === '') {
      showErrorToast({ title: 'Please enter email' });
      return;
    }

    if (password.trim() === '') {
      showErrorToast({ title: 'Please enter password' });
      return;
    }

    const params = {
      email,
      password,
    };
    dispatch(login(params) as any);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={{ marginVertical: ms(20) }}>
        <TextField
          containerStyle={styles.textFieldContainer}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          secureTextEntry
          containerStyle={styles.textFieldContainer}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button style={styles.btnStyle} title="Sign in" type="primary" onPress={onPressLogin} />
    </ScreenWrapper>
  );
};

export default Login;

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
  textFieldContainer: {
    width: '100%',
  },
  btnStyle: {
    marginTop: ms(20),
  },
}));
