import React, { type FC, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { TextStyles } from '@/theme';
import { ms } from '@/utils';

type ButtonTypes = 'primary' | 'secondary' | 'disabled';

interface ButtonProps extends PressableProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  title: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: ButtonTypes;
}

const Button: FC<ButtonProps> = ({
  style = {},
  textStyle = {},
  isLoading = false,
  title,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'primary',
  ...rest
}) => {
  // Style maps for reusability and scalability
  const buttonTypeStyles: Record<ButtonTypes, ViewStyle> = {
    primary: styles.primary,
    secondary: styles.secondary,
    disabled: styles.disabled,
  };

  const textTypeStyles: Record<ButtonTypes, TextStyle> = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    disabled: styles.disabledText,
  };

  // Button is considered disabled if explicitly set or if loading
  const isButtonDisabled = disabled || isLoading || type === 'disabled';

  return (
    <Pressable
      disabled={isButtonDisabled}
      style={({ pressed }) => [buttonTypeStyles[type], pressed && styles.pressed, style]}
      {...rest}
    >
      {isLoading ? (
        // Loading spinner when button is in loading state
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <View style={styles.contentRow}>
          {/* Optional left icon */}
          {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}

          {/* Button title */}
          <Text style={[textTypeStyles[type], TextStyles.button, textStyle]}>{title}</Text>

          {/* Optional right icon */}
          {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  primary: {
    width: '100%',
    borderRadius: ms(28),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(16),
    marginBottom: ms(24),
    backgroundColor: theme.colors.typography,
  },
  secondary: {
    width: '100%',
    borderRadius: ms(28),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(16),
    marginBottom: ms(24),
    borderColor: theme.colors.typography,
    backgroundColor: 'transparent',
  },
  disabled: {
    width: '100%',
    borderRadius: ms(28),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(17.5),
    marginBottom: ms(24),
    backgroundColor: theme.colors.grey,
  },
  pressed: {
    opacity: 0.7,
  },
  primaryText: {
    color: theme.colors.white,
    textAlign: 'center',
  },
  secondaryText: {
    color: theme.colors.typography,
    textAlign: 'center',
  },
  disabledText: {
    color: theme.colors.textGray,
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginHorizontal: ms(8),
  },
}));

export default Button;
