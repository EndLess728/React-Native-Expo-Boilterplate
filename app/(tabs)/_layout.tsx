import React from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/TabBarIcon';
import { TabBarLabel } from '@/components/TabBarLabel';

export default function TabsLayout(): React.JSX.Element {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.typography,
        headerShown: false,
        tabBarIcon: ({ color }: { color: string }) => (
          <TabBarIcon color={color} routeName={route.name} />
        ),
        tabBarLabel: ({ color }: { color: string }) => (
          <TabBarLabel color={color} routeName={route.name} />
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ headerShown: true }} />
      <Tabs.Screen name="profile" options={{ headerShown: true }} />
    </Tabs>
  );
}
