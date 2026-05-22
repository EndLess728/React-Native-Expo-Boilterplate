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
import { z } from 'zod';

import Env from '@env';
import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useUserStore } from '@/store/useUserStore';
import { fonts, TextStyles } from '@/theme';
import { ms } from '@/utils';

const loginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  password: z
    .string({ error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const login = useUserStore((state) => state.login);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // The AuthGate in app/_layout.tsx watches isLoggedIn and redirects to /home
  // once login() flips the store, so no router call is needed here.
  const onSubmit = (data: LoginFormData) => {
    login({ email: data.email });
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
      {__DEV__ && <Text style={styles.envLabel}>{`Environment : ${Env.EXPO_PUBLIC_APP_ENV}`}</Text>}
    </ScreenWrapper>
  );
}

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
  envLabel: {
    color: 'red',
    marginTop: ms(20),
    fontFamily: fonts.openSan.semiBold,
  },
}));
