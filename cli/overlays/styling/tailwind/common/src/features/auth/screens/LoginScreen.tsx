import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { z } from 'zod';

import Env from '@env';
import { useTranslate } from '@/localization/utils';
import Button from '@/shared/components/Button';
import { ControlledTextField } from '@/shared/components/ControlledTextField';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { useAppTheme } from '@/theme';

import { useLogin } from '../hooks';

const getLoginSchema = (t: ReturnType<typeof useTranslate>) =>
  z.object({
    email: z
      .string({ error: t('validation.email_required') })
      .min(1, t('validation.email_required'))
      .email(t('validation.email_invalid')),

    password: z
      .string({ error: t('validation.password_required') })
      .min(1, t('validation.password_required'))
      .min(6, t('validation.password_min_length')),
  });

type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;

export function LoginScreen() {
  const theme = useAppTheme();
  const { login, isLoading } = useLogin();
  const t = useTranslate();

  const schema = React.useMemo(() => getLoginSchema(t), [t]);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <ScreenWrapper className="items-center justify-center p-5">
      <View className="mb-4">
        <Ionicons color={theme.colors.primary} name="lock-closed-outline" size={48} />
      </View>
      <Text className="text-h1 font-opensans-bold text-typography">{t('auth.login')}</Text>
      <View className="my-5 w-full">
        <ControlledTextField<LoginFormData>
          autoCapitalize="none"
          autoComplete="email"
          containerClassName="w-full"
          control={control}
          keyboardType="email-address"
          name="email"
          placeholder={t('auth.enter_email')}
          returnKeyType="next"
          textContentType="emailAddress"
        />

        <ControlledTextField<LoginFormData>
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          containerClassName="w-full"
          control={control}
          name="password"
          placeholder={t('auth.enter_password')}
          returnKeyType="done"
          textContentType="password"
        />
      </View>

      <Button
        className="mt-5"
        isLoading={isLoading}
        title={t('auth.sign_in')}
        type="primary"
        onPress={() => handleSubmit(onSubmit)()}
      />
      {__DEV__ && (
        <Text className="mt-5 text-body font-opensans-semibold text-danger">
          {`Environment : ${Env.EXPO_PUBLIC_APP_ENV}`}
        </Text>
      )}
    </ScreenWrapper>
  );
}
