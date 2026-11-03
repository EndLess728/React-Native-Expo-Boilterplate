import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { NAVIGATION } from '@/shared/constants';

import type { RootStackParamList } from './types';

/**
 * Deep links: `<scheme>://` opens Home, `<scheme>://profile` opens Profile.
 * The scheme comes from `scheme` in app.config.ts.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      [NAVIGATION.auth]: {
        screens: {
          [NAVIGATION.login]: 'login',
        },
      },
      [NAVIGATION.main]: {
        screens: {
          [NAVIGATION.home]: '',
          [NAVIGATION.profile]: 'profile',
        },
      },
    },
  },
};
