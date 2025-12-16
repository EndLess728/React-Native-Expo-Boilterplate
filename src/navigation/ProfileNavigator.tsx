import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { NAVIGATION } from '@/constants';
import { Profile } from '@/screens';

export type ProfileStackParamList = {
  [NAVIGATION.profile]: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator id="ProfileStack">
      <Stack.Screen
        component={Profile}
        name={NAVIGATION.profile}
        options={{ headerLargeTitle: true }}
      />
    </Stack.Navigator>
  );
}
