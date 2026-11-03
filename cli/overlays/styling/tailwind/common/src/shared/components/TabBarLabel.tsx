import React from 'react';
import { Text } from 'react-native';

import type { TxKeyPath } from '@/localization/utils';
import { useTranslate } from '@/localization/utils';
import { NAVIGATION } from '@/shared/constants';

const tabLabel: Record<string, TxKeyPath> = {
  [NAVIGATION.home]: 'tabs.home',
  [NAVIGATION.settings]: 'tabs.settings',
};

interface TabBarLabelProps {
  color: string;
  routeName: string;
}

export function TabBarLabel({ color, routeName }: TabBarLabelProps) {
  const t = useTranslate();

  return (
    <Text className="text-caption font-opensans" style={{ color }}>
      {t(tabLabel[routeName])}
    </Text>
  );
}
