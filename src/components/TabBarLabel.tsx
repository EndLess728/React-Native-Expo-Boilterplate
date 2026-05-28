import React from 'react';
import { Text } from 'react-native';

import { NAVIGATION } from '@/constants';
import type { TxKeyPath } from '@/localization/utils';
import { useTranslate } from '@/localization/utils';
import { TextStyles } from '@/theme';

const tabLabel: Record<string, TxKeyPath> = {
  [NAVIGATION.home]: 'tabs.home',
  [NAVIGATION.profile]: 'tabs.profile',
};

interface TabBarLabelProps {
  color: string;
  routeName: string;
}

export function TabBarLabel({ color, routeName }: TabBarLabelProps) {
  const t = useTranslate();

  return <Text style={[TextStyles.caption, { color }]}>{t(tabLabel[routeName])}</Text>;
}
