import React from 'react';
import { Platform, View, type ViewStyle } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import Toast from 'react-native-toast-message';

import FullScreenLoader from '@/shared/components/FullScreenLoader';
import { useIsAppLoaderVisible } from '@/shared/utils/appLoader';
import { toastConfig } from '@/shared/utils/toast';

// On iOS, native modal screens are presented above the app's root view, so toasts
// need FullWindowOverlay to stay visible over them. On Android they share the root
// view, and rendering last is enough.
const Container = Platform.OS === 'ios' ? FullWindowOverlay : React.Fragment;

// A plain object: this file is shared by every styling option.
const fillParent: ViewStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 };

/** App-wide layer above the navigator: the loader, with toasts on top of it. */
export function AppOverlay(): React.JSX.Element {
  const isLoaderVisible = useIsAppLoaderVisible();

  return (
    <Container>
      {/* FullWindowOverlay stacks children in mount order, ignoring their order
          here, so this one view keeps the toast above a loader that mounts later. */}
      <View collapsable={false} pointerEvents="box-none" style={fillParent}>
        <FullScreenLoader visible={isLoaderVisible} />
        <Toast config={toastConfig} position="top" />
      </View>
    </Container>
  );
}
