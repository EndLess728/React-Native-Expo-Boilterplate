import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { linking, RootNavigator } from '@/navigation';
import { AppProviders, useAppBootstrap } from '@/providers';

export default function App(): React.JSX.Element | null {
  const isReady = useAppBootstrap();

  if (!isReady) {
    return null;
  }

  return (
    <AppProviders>
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}
