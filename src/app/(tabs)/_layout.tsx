import React from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/TabBarIcon';
import { TabBarLabel } from '@/components/TabBarLabel';
import { useTranslate } from '@/localization/utils';

export default function TabsLayout(): React.JSX.Element {
  const { theme } = useUnistyles();
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
      <Tabs.Screen name="profile" options={{ headerShown: true, title: t('tabs.profile') }} />
    </Tabs>
  );
}
