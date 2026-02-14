/**
 * ControlledTextField
 *
 * A wrapper around `TextField` that integrates with React Hook Form.
 * Use this instead of `TextField` when you need form validation.
 *
 * Usage:
 * ```tsx
 * <ControlledTextField
 *   control={control}
 *   name="email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 * />
 * ```
 */

import React from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Text, type TextInputProps, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ms } from '@/utils';

import TextField from './TextField';

interface ControlledTextFieldProps<T extends FieldValues> extends Omit<
  TextInputProps,
  'value' | 'onChangeText'
> {
  /** React Hook Form control object from `useForm()` */
  control: Control<T>;

  /** Field name — must match a key in your Zod schema */
  name: Path<T>;

  /** Placeholder text for the input */
  placeholder?: string;

  /** Style for the outer container (passed to TextField) */
  containerStyle?: ViewStyle;
}

export function ControlledTextField<T extends FieldValues>({
  control,
  name,
  containerStyle,
  ...rest
}: ControlledTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TextField
            containerStyle={containerStyle}
            hasError={!!error}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            {...rest}
          />
          {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
        </>
      )}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  errorText: {
    color: theme.colors.danger,
    fontSize: ms(12),
    marginTop: ms(-6),
    marginBottom: ms(4),
    marginLeft: ms(4),
  },
}));
