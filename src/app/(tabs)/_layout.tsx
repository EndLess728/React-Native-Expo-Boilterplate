import React from 'react';
import { Tabs } from 'expo-router';

import { useTranslate } from '@/localization/utils';
import { TabBarIcon } from '@/shared/components/TabBarIcon';
import { TabBarLabel } from '@/shared/components/TabBarLabel';
import { useAppTheme } from '@/theme';

export default function TabsLayout(): React.JSX.Element {
  const theme = useAppTheme();
  const t = useTranslate();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        // Inactive tabs use a muted gray; using `typography` here renders
        // them as full-strength black/white, indistinguishable from active.
        tabBarInactiveTintColor: theme.colors.iconGray,
        headerShown: false,
        tabBarIcon: ({ color }) => <TabBarIcon color={color as string} routeName={route.name} />,
        tabBarLabel: ({ color }) => <TabBarLabel color={color as string} routeName={route.name} />,
      })}
    >
      <Tabs.Screen name="index" options={{ headerShown: true, title: t('tabs.home') }} />
      <Tabs.Screen name="settings" options={{ headerShown: true, title: t('tabs.settings') }} />
    </Tabs>
  );
}
