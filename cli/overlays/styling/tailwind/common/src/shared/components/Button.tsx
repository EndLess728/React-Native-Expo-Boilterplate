import React, { type FC, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps, Text, View } from 'react-native';

type ButtonTypes = 'primary' | 'secondary' | 'disabled';

interface ButtonProps extends PressableProps {
  /** Extra classes for the button itself (margins, width, …). */
  className?: string;
  /** Extra classes for the title text. */
  textClassName?: string;
  isLoading?: boolean;
  title: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: ButtonTypes;
}

// Full class names (no string building) so Tailwind can find them.
const BUTTON_CLASSES: Record<ButtonTypes, string> = {
  primary: 'bg-typography',
  secondary: 'border border-typography bg-transparent',
  disabled: 'bg-grey',
};

const TEXT_CLASSES: Record<ButtonTypes, string> = {
  primary: 'text-white',
  secondary: 'text-typography',
  disabled: 'text-text-gray',
};

const Button: FC<ButtonProps> = ({
  className = '',
  textClassName = '',
  isLoading = false,
  title,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'primary',
  ...rest
}) => {
  // Button is considered disabled if explicitly set or if loading
  const isButtonDisabled = disabled || isLoading || type === 'disabled';

  return (
    <Pressable
      className={`mb-6 w-full items-center justify-center rounded-[28px] py-4 active:opacity-70 ${BUTTON_CLASSES[type]} ${className}`}
      disabled={isButtonDisabled}
      {...rest}
    >
      {isLoading ? (
        // Loading spinner when button is in loading state
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {/* Optional left icon */}
          {leftIcon && <View className="mx-2">{leftIcon}</View>}

          {/* Button title */}
          <Text
            className={`text-button font-opensans-semibold text-center ${TEXT_CLASSES[type]} ${textClassName}`}
          >
            {title}
          </Text>

          {/* Optional right icon */}
          {rightIcon && <View className="mx-2">{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export default Button;
