import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { translate } from '@/localization/utils';
import { useAppTheme } from '@/theme';

interface FullScreenLoaderProps {
  visible: boolean;
  size?: 'small' | 'large';
  color?: string;
  /** Uses a lighter dim and theme-colored text, so a modal still looks solid. */
  inModal?: boolean;
}

/**
 * Loading overlay that fills its parent and blocks touches on what's beneath it.
 *
 * It is a plain view rather than a native `Modal`, so it can't get stuck over the
 * app. Screens get it through `ScreenWrapper`'s `showLoader`. Inside a modal, pass
 * `isModal` to `ScreenWrapper`, or render it here with `inModal` as the last child
 * of the view to cover (give a view with rounded corners `overflow-hidden`).
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  visible = false,
  size = 'large',
  color,
  inModal = false,
}) => {
  const theme = useAppTheme();

  if (!visible) return null;

  const label = translate('common.loading');

  return (
    <View
      accessibilityViewIsModal
      accessible
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      className="absolute inset-0 items-center justify-center"
    >
      <View className={`absolute inset-0 ${inModal ? 'bg-black/35' : 'bg-opacity50'}`} />
      <ActivityIndicator color={color || theme.colors.primary} size={size} />
      <Text
        className={`text-label font-opensans-bold mt-2.5 ${inModal ? 'text-typography' : 'text-white'}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default FullScreenLoader;
