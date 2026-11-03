import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '@/features/home';
import { SettingsScreen } from '@/features/settings';
import { useTranslate } from '@/localization/utils';
import { TabBarIcon } from '@/shared/components/TabBarIcon';
import { TabBarLabel } from '@/shared/components/TabBarLabel';
import { NAVIGATION } from '@/shared/constants';
import { useAppTheme } from '@/theme';

import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator(): React.JSX.Element {
  const theme = useAppTheme();
  const t = useTranslate();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        // Inactive tabs use a muted gray; using `typography` here renders
        // them as full-strength black/white, indistinguishable from active.
        tabBarInactiveTintColor: theme.colors.iconGray,
        tabBarIcon: ({ color }) => <TabBarIcon color={color} routeName={route.name} />,
        tabBarLabel: ({ color }) => <TabBarLabel color={color} routeName={route.name} />,
      })}
    >
      <Tab.Screen
        component={HomeScreen}
        name={NAVIGATION.home}
        options={{ title: t('tabs.home') }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name={NAVIGATION.settings}
        options={{ title: t('tabs.settings') }}
      />
    </Tab.Navigator>
  );
}
