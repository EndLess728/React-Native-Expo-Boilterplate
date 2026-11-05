import React from 'react';
import {
  ImageBackground,
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native-unistyles';

import FullScreenLoader from '@/shared/components/FullScreenLoader';
import { useScreenLoader } from '@/shared/hooks/useScreenLoader';

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

  const content = scrollable ? (
    <KeyboardAwareScrollView
      bottomOffset={keyboardBottomOffset}
      contentContainerStyle={[styles.scrollContainer, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      {children}
    </KeyboardAwareScrollView>
  ) : (
    <View style={[styles.viewContainer, style]}>{children}</View>
  );

  return backgroundImage ? (
    <ImageBackground
      imageStyle={backgroundImageStyle}
      resizeMode={backgroundImageResizeMode}
      source={backgroundImage}
      style={styles.wrapper}
    >
      {content}
      {modalLoader}
    </ImageBackground>
  ) : (
    <View style={styles.wrapper}>
      {content}
      {modalLoader}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    paddingBottom: rt.insets.bottom,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: rt.insets.bottom,
  },
}));
