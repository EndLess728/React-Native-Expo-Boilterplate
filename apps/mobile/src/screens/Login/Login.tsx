/**
 * Login Screen
 *
 * Uses React Hook Form + Zod for form validation.
 * Validation errors are displayed inline below each field.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '@repo/shared';

import Env from '@env';
import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useUserStore } from '@/store/useUserStore';
import { fonts, TextStyles } from '@/theme';
import { ms } from '@/utils';

// ─────────────────────────────────────────────────────────────
//  Screen Component
// ─────────────────────────────────────────────────────────────

const Login: React.FC = () => {
  const login = useUserStore((state) => state.login);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Only called when Zod validation passes.
   * Replace with your actual API login call.
   */
  const onSubmit = (data: LoginFormData) => {
    login({ email: data.email, password: data.password });
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={TextStyles.h1}>Login</Text>
      <View style={styles.formContainer}>
        <ControlledTextField<LoginFormData>
          autoCapitalize="none"
          autoComplete="email"
          containerStyle={styles.textFieldContainer}
          control={control}
          keyboardType="email-address"
          name="email"
          placeholder="Enter your email"
          returnKeyType="next"
          textContentType="emailAddress"
        />

        <ControlledTextField<LoginFormData>
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          containerStyle={styles.textFieldContainer}
          control={control}
          name="password"
          placeholder="Enter your password"
          returnKeyType="done"
          textContentType="password"
        />
      </View>

      <Button
        style={styles.btnStyle}
        title="Sign in"
        type="primary"
        onPress={handleSubmit(onSubmit)}
      />
      {__DEV__ && (
        <Text
          style={{ color: 'red', marginTop: ms(20), fontFamily: fonts.openSan.semiBold }}
        >{`Environment : ${Env.EXPO_PUBLIC_APP_ENV}`}</Text>
      )}
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
  formContainer: {
    width: '100%',
    marginVertical: ms(20),
  },
  textFieldContainer: {
    width: '100%',
  },
  btnStyle: {
    marginTop: ms(20),
  },
}));
