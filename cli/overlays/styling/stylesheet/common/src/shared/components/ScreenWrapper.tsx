import React from 'react';
import {
  ImageBackground,
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FullscreenLoader from '@/shared/components/FullScreenLoader';
import { useAppTheme } from '@/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Layout style (padding, justifyContent, alignItems, etc.). Routed to the content container in scrollable mode, or the outer View otherwise. */
  style?: ViewStyle;
  showLoader?: boolean;
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
  scrollable = false,
  backgroundImage,
  backgroundImageStyle,
  backgroundImageResizeMode = 'cover',
  keyboardBottomOffset = 20,
}) => {
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

  const body = backgroundImage ? (
    <ImageBackground
      imageStyle={backgroundImageStyle}
      resizeMode={backgroundImageResizeMode}
      source={backgroundImage}
      style={wrapperStyle}
    >
      {content}
    </ImageBackground>
  ) : (
    <View style={wrapperStyle}>{content}</View>
  );

  return (
    <>
      {body}
      <FullscreenLoader visible={showLoader} />
    </>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
