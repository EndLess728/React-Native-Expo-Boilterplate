import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { NAVIGATION } from '@/shared/constants';

export type AuthStackParamList = {
  [NAVIGATION.login]: undefined;
};

export type MainTabParamList = {
  [NAVIGATION.home]: undefined;
  [NAVIGATION.profile]: undefined;
};

export type RootStackParamList = {
  [NAVIGATION.auth]: NavigatorScreenParams<AuthStackParamList>;
  [NAVIGATION.main]: NavigatorScreenParams<MainTabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Types `useNavigation()`, `<Link>` and `navigation.navigate()` app-wide
// without passing generics around.
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
