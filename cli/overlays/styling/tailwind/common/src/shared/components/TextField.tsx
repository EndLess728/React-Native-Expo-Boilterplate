import React, { forwardRef, useEffect } from 'react';
import {
  Image,
  type ImageSourcePropType,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useAppTheme } from '@/theme';

interface TextFieldProps extends TextInputProps {
  placeholder?: string;
  /** Extra classes for the bordered container. */
  containerClassName?: string;
  endIcon?: ImageSourcePropType;
  icon?: ImageSourcePropType;
  endIconClassName?: string;
  /** When true, border turns danger-red and stays red regardless of focus state */
  hasError?: boolean;
}

const TextField = forwardRef<TextInputInstance, TextFieldProps>(
  (
    {
      placeholder = '',
      containerClassName = '',
      endIcon,
      icon,
      endIconClassName = '',
      hasError = false,
      className = '',
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const theme = useAppTheme();
    // The border color animates, so it stays a JS value rather than a class.
    const borderColor = useSharedValue<string>(
      hasError ? theme.colors.danger : theme.colors.borderGray,
    );

    // React to error state changes
    useEffect(() => {
      borderColor.value = withTiming(hasError ? theme.colors.danger : theme.colors.borderGray);
    }, [hasError, borderColor, theme.colors.danger, theme.colors.borderGray]);

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

    return (
      <Animated.View
        className={`my-2.5 h-[50px] flex-row items-center rounded-[10px] border bg-faded-white p-3 ${containerClassName}`}
        style={animatedBorderStyle}
      >
        {icon && <Image className="mr-2.5 h-5 w-5" resizeMode="contain" source={icon} />}
        <TextInput
          ref={ref}
          autoComplete="off"
          autoCorrect={false}
          className={`h-10 flex-1 text-body-sm font-opensans-semibold text-typography ${className}`}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textGray}
          underlineColorAndroid="transparent"
          onBlur={(e) => {
            borderColor.value = withTiming(
              hasError ? theme.colors.danger : theme.colors.borderGray,
            );
            onBlur?.(e);
          }}
          onFocus={(e) => {
            borderColor.value = withTiming(hasError ? theme.colors.danger : theme.colors.primary);
            onFocus?.(e);
          }}
          {...rest}
        />
        {endIcon && (
          <View>
            <Image
              className={`h-[25px] w-[25px] ${endIconClassName}`}
              resizeMode="contain"
              source={endIcon}
              style={{ tintColor: theme.colors.typography }}
            />
          </View>
        )}
      </Animated.View>
    );
  },
);

export default TextField;
