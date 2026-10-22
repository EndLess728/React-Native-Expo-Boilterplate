import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useIsLoggedIn } from '@/features/auth';
import { NAVIGATION } from '@/shared/constants';

import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Auth gating: only the navigator for the current session state is mounted.
 * Screens never redirect themselves — `useLogin()` / `useLogout()` flip the
 * session and React Navigation swaps the tree (and animates it) on its own.
 */
export function RootNavigator(): React.JSX.Element {
  const isLoggedIn = useIsLoggedIn();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen component={MainTabNavigator} name={NAVIGATION.main} />
      ) : (
        <Stack.Screen component={AuthNavigator} name={NAVIGATION.auth} />
      )}
    </Stack.Navigator>
  );
}
