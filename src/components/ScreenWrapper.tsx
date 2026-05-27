import React from 'react';
import {
  ImageBackground,
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native-unistyles';

import FullscreenLoader from '@/components/FullScreenLoader';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showLoader?: boolean;
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
  style = {},
  showLoader = false,
  scrollable = false,
  backgroundImage,
  backgroundImageStyle,
  backgroundImageResizeMode = 'cover',
  keyboardBottomOffset = 20,
}) => {
  const content = scrollable ? (
    <KeyboardAwareScrollView
      bottomOffset={keyboardBottomOffset}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={[styles.container, style]}
    >
      {children}
    </KeyboardAwareScrollView>
  ) : (
    <KeyboardAvoidingView behavior="padding" style={[styles.container, style]}>
      {children}
    </KeyboardAvoidingView>
  );

  const body = backgroundImage ? (
    <ImageBackground
      imageStyle={backgroundImageStyle}
      resizeMode={backgroundImageResizeMode}
      source={backgroundImage}
      style={styles.wrapper}
    >
      {content}
    </ImageBackground>
  ) : (
    <View style={styles.wrapper}>{content}</View>
  );

  return (
    <>
      {body}
      <FullscreenLoader visible={showLoader} />
    </>
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
    paddingBottom: rt.insets.bottom,
  },
  scrollContainer: {
    flexGrow: 1,
  },
}));
