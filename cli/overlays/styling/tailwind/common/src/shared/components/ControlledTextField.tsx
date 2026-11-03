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
import { Text, type TextInputProps } from 'react-native';

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

  /** Classes for the outer container (passed to TextField) */
  containerClassName?: string;
}

export function ControlledTextField<T extends FieldValues>({
  control,
  name,
  containerClassName,
  ...rest
}: ControlledTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TextField
            containerClassName={containerClassName}
            hasError={!!error}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            {...rest}
          />
          {error?.message && (
            <Text className="-mt-1.5 mb-1 ml-1 text-xs text-danger">{error.message}</Text>
          )}
        </>
      )}
    />
  );
}
