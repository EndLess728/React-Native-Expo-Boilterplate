import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { NAVIGATION } from '@/constants';
import { Home } from '@/screens';

export type HomeStackParamList = {
  [NAVIGATION.home]: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator id="HomeStack">
      <Stack.Screen component={Home} name={NAVIGATION.home} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}
