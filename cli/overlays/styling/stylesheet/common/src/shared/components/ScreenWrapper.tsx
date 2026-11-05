import React from 'react';
import {
  Image,
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FullScreenLoader from '@/shared/components/FullScreenLoader';
import { useScreenLoader } from '@/shared/hooks/useScreenLoader';
import { useAppTheme } from '@/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Layout style (padding, justifyContent, alignItems, etc.). Routed to the content container in scrollable mode, or the outer View otherwise. */
  style?: ViewStyle;
  showLoader?: boolean;
  /** Set on modal screens, and inside a React Native `<Modal>`: `showLoader` then covers only this content, not the whole app. */
  isModal?: boolean;
  /** Enable for any screen with text inputs. Scrolls only when needed to keep the focused input above the keyboard. */
  scrollable?: boolean;
  /** Optional full-screen background image. Renders behind all content. */
  backgroundImage?: ImageSourcePropType;
  /** Style applied to the underlying <Image> when `backgroundImage` is set. */
  backgroundImageStyle?: ImageStyle;
  /** `resizeMode` for `backgroundImage`. Defaults to `cover`. */
  backgroundImageResizeMode?: ImageResizeMode;
  /** Distance kept between the keyboard and the focused input in scrollable mode. */
  keyboardBottomOffset?: number;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  showLoader = false,
  isModal = false,
  scrollable = false,
  backgroundImage,
  backgroundImageStyle,
  backgroundImageResizeMode = 'cover',
  keyboardBottomOffset = 20,
}) => {
  useScreenLoader(showLoader && !isModal);
  const modalLoader = isModal ? <FullScreenLoader inModal visible={showLoader} /> : null;

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const wrapperStyle = [styles.wrapper, { backgroundColor: theme.colors.background }];
  const bottomInset = { paddingBottom: insets.bottom };

  const content = scrollable ? (
    <KeyboardAwareScrollView
      bottomOffset={keyboardBottomOffset}
      contentContainerStyle={[styles.scrollContainer, bottomInset, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      {children}
    </KeyboardAwareScrollView>
  ) : (
    <View style={[styles.viewContainer, bottomInset, style]}>{children}</View>
  );

  return (
    <View style={wrapperStyle}>
      {backgroundImage ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode={backgroundImageResizeMode}
          source={backgroundImage}
          style={[styles.backgroundImage, backgroundImageStyle]}
        />
      ) : null}
      {content}
      {modalLoader}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  // The explicit size overrides the file's own dimensions, which `Image` applies
  // to a `require`d source and which would otherwise beat the absolute edges.
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
