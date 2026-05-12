import React from 'react';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';

import { TabBarIcon } from '@/components/TabBarIcon';
import { TabBarLabel } from '@/components/TabBarLabel';
import { NAVIGATION } from '@/constants';
import { HomeNavigator } from '@/navigation/HomeNavigator';
import { ProfileNavigator } from '@/navigation/ProfileNavigator';

// Define the tab param list
export type AppTabParamList = {
  [NAVIGATION.homeNavigator]: undefined;
  [NAVIGATION.profileNavigator]: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// Defined outside the component — stable references, no recreation on re-render
const renderTabIcon = (
  color: string,
  route: RouteProp<AppTabParamList, keyof AppTabParamList>,
): React.JSX.Element => <TabBarIcon color={color} routeName={route.name} />;

const renderTabLabel = (
  color: string,
  route: RouteProp<AppTabParamList, keyof AppTabParamList>,
): React.JSX.Element => <TabBarLabel color={color} routeName={route.name} />;

export function AppNavigator(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      id="AppTabs"
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        headerShown: false,
        tabBarIcon: ({ color }: { color: string }) => renderTabIcon(color, route),
        tabBarLabel: ({ color }: { color: string }) => renderTabLabel(color, route),
      })}
    >
      <Tab.Screen component={HomeNavigator} name={NAVIGATION.homeNavigator} />
      <Tab.Screen component={ProfileNavigator} name={NAVIGATION.profileNavigator} />
    </Tab.Navigator>
  );
}
