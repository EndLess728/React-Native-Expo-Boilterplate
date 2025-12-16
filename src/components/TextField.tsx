import React, { forwardRef } from 'react';
import {
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  Pressable,
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { TextStyles } from '@/theme';
import { ms } from '@/utils';

interface TextFieldProps extends TextInputProps {
  icon?: ImageSourcePropType;
  containerStyle?: ViewStyle;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  rightIcon?: ImageSourcePropType;
  onPressRightIcon?: () => void;
  rightIconStyle?: ImageStyle;
}

export const TextField = forwardRef<any, TextFieldProps>(
  (
    {
      style,
      icon,
      rightIcon,
      containerStyle,
      placeholder,
      onPressRightIcon = () => {},
      rightIconStyle,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useUnistyles();

    return (
      <View style={[styles.container, containerStyle]}>
        {icon && <Image source={icon} style={styles.leftImageStyle} />}
        <TextInput
          ref={ref}
          autoComplete="off"
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={'#808080'}
          style={[
            {
              color: theme.colors.textGray,
              flex: 1,
              height: ms(40),
            },
            TextStyles.smallText,
            style,
          ]}
          underlineColorAndroid="transparent"
          {...rest}
        />
        {rightIcon && (
          <Pressable onPress={onPressRightIcon}>
            <Image source={rightIcon} style={[styles.eyeIcon, rightIconStyle]} />
          </Pressable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create(() => ({
  leftImageStyle: {
    width: ms(20),
    height: ms(20),
    marginRight: ms(10),
    resizeMode: 'contain',
  },
  container: {
    padding: ms(12),
    borderWidth: ms(1),
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ms(10),
    borderRadius: ms(10),
    borderColor: '#004AAD',
    backgroundColor: '#F7F8F9',
    height: ms(50),
  },
  eyeIcon: {
    height: ms(25),
    resizeMode: 'contain',
    tintColor: '#000',
  },
}));
