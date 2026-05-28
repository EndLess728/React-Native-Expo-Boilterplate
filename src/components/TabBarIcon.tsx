import React from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { homeIcon, settingsIcon } from '@/assets';
import { NAVIGATION } from '@/constants';
import { ms } from '@/utils';

const tabIcon: Record<string, ImageSourcePropType> = {
  [NAVIGATION.home]: homeIcon,
  [NAVIGATION.profile]: settingsIcon,
};

interface TabBarIconProps {
  color: string;
  routeName: string;
}

export function TabBarIcon({ color, routeName }: TabBarIconProps) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      source={tabIcon[routeName]}
      style={[styles.icon, { tintColor: color }]}
    />
  );
}

const styles = StyleSheet.create(() => ({
  icon: {
    width: ms(24),
    height: ms(24),
    resizeMode: 'contain',
  },
}));
