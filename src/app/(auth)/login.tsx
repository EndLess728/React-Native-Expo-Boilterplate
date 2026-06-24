import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { z } from 'zod';

import Env from '@env';
import Button from '@/components/Button';
import { ControlledTextField } from '@/components/ControlledTextField';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useTranslate } from '@/localization/utils';
import { useUserStore } from '@/store/useUserStore';
import { TextStyles } from '@/theme';
import { ms } from '@/utils';

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

export default function LoginScreen() {
  const { theme } = useUnistyles();
  const login = useUserStore((state) => state.login);
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
    login({ email: data.email });
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Ionicons
        color={theme.colors.primary}
        name="lock-closed-outline"
        size={ms(48)}
        style={styles.icon}
      />
      <Text style={TextStyles.h1}>{t('auth.login')}</Text>
      <View style={styles.formContainer}>
        <ControlledTextField<LoginFormData>
          autoCapitalize="none"
          autoComplete="email"
          containerStyle={styles.textFieldContainer}
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
          containerStyle={styles.textFieldContainer}
          control={control}
          name="password"
          placeholder={t('auth.enter_password')}
          returnKeyType="done"
          textContentType="password"
        />
      </View>

      <Button
        style={styles.btnStyle}
        title={t('auth.sign_in')}
        type="primary"
        onPress={handleSubmit(onSubmit)}
      />
      {__DEV__ && (
        <Text style={[TextStyles.bodySemiBold, styles.envLabel]}>
          {`Environment : ${Env.EXPO_PUBLIC_APP_ENV}`}
        </Text>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: ms(16),
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
    color: theme.colors.danger,
    marginTop: ms(20),
  },
}));
