import React from 'react';
import {
  ImageBackground,
  type ImageResizeMode,
  type ImageSourcePropType,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FullscreenLoader from '@/shared/components/FullScreenLoader';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Layout classes (padding, justify-*, items-*, …). Applied to the content in both scrollable and static mode. */
  className?: string;
  showLoader?: boolean;
  /** Enable for any screen with text inputs. Scrolls only when needed to keep the focused input above the keyboard. */
  scrollable?: boolean;
  /** Optional full-screen background image. Renders behind all content. */
  backgroundImage?: ImageSourcePropType;
  /** Classes applied to the underlying <Image> when `backgroundImage` is set. */
  backgroundImageClassName?: string;
  /** `resizeMode` for `backgroundImage`. Defaults to `cover`. */
  backgroundImageResizeMode?: ImageResizeMode;
  /** Distance kept between the keyboard and the focused input in scrollable mode. */
  keyboardBottomOffset?: number;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = '',
  showLoader = false,
  scrollable = false,
  backgroundImage,
  backgroundImageClassName,
  backgroundImageResizeMode = 'cover',
  keyboardBottomOffset = 20,
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = { paddingBottom: insets.bottom };

  // The content View carries the layout classes in both modes, so the caller
  // never has to think about scroll view content containers.
  const content = scrollable ? (
    <KeyboardAwareScrollView
      bottomOffset={keyboardBottomOffset}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      <View className={`grow ${className}`} style={bottomInset}>
        {children}
      </View>
    </KeyboardAwareScrollView>
  ) : (
    <View className={`flex-1 ${className}`} style={bottomInset}>
      {children}
    </View>
  );

  const body = backgroundImage ? (
    <ImageBackground
      className="flex-1 bg-background"
      imageClassName={backgroundImageClassName}
      resizeMode={backgroundImageResizeMode}
      source={backgroundImage}
    >
      {content}
    </ImageBackground>
  ) : (
    <View className="flex-1 bg-background">{content}</View>
  );

  return (
    <>
      {body}
      <FullscreenLoader visible={showLoader} />
    </>
  );
};

export default ScreenWrapper;
