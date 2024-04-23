import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {TabBarIcon} from '@/components';
import {NAVIGATION} from '@/constants';
import {HomeNavigator} from '@/navigation/HomeNavigator';
import {ProfileNavigator} from '@/navigation/ProfileNavigator';
import {TabBarLabel} from '@/components/TabBarLabel';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const {colors} = useTheme();

  const renderTabIcon = (color, route) => (
    <TabBarIcon color={color} routeName={route.name} />
  );
  const renderTabLabel = (color, route) => (
    <TabBarLabel color={color} routeName={route.name} />
  );

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: colors.activeTab,
        tabBarInactiveTintColor: colors.inactiveTab,
        headerShown: false,
        tabBarIcon: ({color}) => renderTabIcon(color, route),
        tabBarLabel: ({color}) => renderTabLabel(color, route),
      })}>
      <Tab.Screen name={NAVIGATION.homeNavigator} component={HomeNavigator} />
      <Tab.Screen
        name={NAVIGATION.profileNavigator}
        component={ProfileNavigator}
      />
    </Tab.Navigator>
  );
}
