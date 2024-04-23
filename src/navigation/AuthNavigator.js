import React from 'react';
import {NAVIGATION} from '@/constants';
import {Login} from '@/screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Login}
        name={NAVIGATION.login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
