import React from 'react';
import { Text } from 'react-native';

import { NAVIGATION } from '@/constants';
import { TextStyles } from '@/theme';

const tabLabel: Record<string, string> = {
  [NAVIGATION.homeNavigator]: 'Home',
  [NAVIGATION.profileNavigator]: 'Profile',
};

interface TabBarLabelProps {
  color: string;
  routeName: string;
}

export function TabBarLabel({ color, routeName }: TabBarLabelProps) {
  return <Text style={[TextStyles.caption, { color }]}>{tabLabel[routeName]}</Text>;
}
