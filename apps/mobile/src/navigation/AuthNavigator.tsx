import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NAVIGATION } from '@/constants';
import Login from '@/screens/Login/Login';

export type AuthStackParamList = {
  [NAVIGATION.login]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator id="AuthStack">
      <Stack.Screen component={Login} name={NAVIGATION.login} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
