import React from 'react';
import { Image, type ImageSourcePropType } from 'react-native';

import { homeIcon, settingsIcon } from '@/assets';
import { NAVIGATION } from '@/shared/constants';

const tabIcon: Record<string, ImageSourcePropType> = {
  [NAVIGATION.home]: homeIcon,
  [NAVIGATION.settings]: settingsIcon,
};

interface TabBarIconProps {
  color: string;
  routeName: string;
}

export function TabBarIcon({ color, routeName }: TabBarIconProps) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      className="h-6 w-6"
      resizeMode="contain"
      source={tabIcon[routeName]}
      style={{ tintColor: color }}
    />
  );
}
