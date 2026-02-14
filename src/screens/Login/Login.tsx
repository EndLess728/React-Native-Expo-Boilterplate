/**
 * Login Screen
 *
 * Uses React Hook Form + Zod for form validation.
 * Validation errors are displayed inline below each field.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { z } from 'zod';

import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useUserStore } from '@/store/useUserStore';
import { fonts } from '@/theme';
import { ms } from '@/utils';

// ─────────────────────────────────────────────────────────────
//  Validation Schema
// ─────────────────────────────────────────────────────────────

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

/** Infer TypeScript type from the schema — keeps types in sync automatically */
type LoginFormData = z.infer<typeof loginSchema>;

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
  const onSubmit = useCallback(
    (data: LoginFormData) => {
      login({ email: data.email, password: data.password });
    },
    [login],
  );

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
