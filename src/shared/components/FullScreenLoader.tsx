import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { translate } from '@/localization/utils';
import { ms } from '@/shared/utils';
import { TextStyles } from '@/theme';

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
 * of the view to cover (give a view with rounded corners `overflow: 'hidden'`).
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  visible = false,
  size = 'large',
  color,
  inModal = false,
}) => {
  const { theme } = useUnistyles();

  if (!visible) return null;

  const label = translate('common.loading');

  return (
    <View
      accessibilityViewIsModal
      accessible
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      style={styles.overlay}
    >
      <View style={inModal ? styles.modalBackdrop : styles.screenBackdrop} />
      <ActivityIndicator color={color || theme.colors.primary} size={size} />
      <Text style={[TextStyles.label, inModal ? styles.modalText : styles.screenText]}>
        {label}
      </Text>
    </View>
  );
};

const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

const styles = StyleSheet.create((theme) => ({
  overlay: { ...fill, justifyContent: 'center', alignItems: 'center' },
  screenBackdrop: { ...fill, backgroundColor: theme.colors.opacity50 },
  modalBackdrop: { ...fill, backgroundColor: 'rgba(0,0,0,0.35)' },
  screenText: { color: theme.colors.white, marginTop: ms(10) },
  modalText: { color: theme.colors.typography, marginTop: ms(10) },
}));

export default FullScreenLoader;
