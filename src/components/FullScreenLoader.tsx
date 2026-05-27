import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { TextStyles } from '@/theme';
import { ms } from '@/utils';

interface FullscreenLoaderProps {
  visible: boolean;
  size?: 'small' | 'large';
  color?: string;
}

const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  visible = false,
  size = 'large',
  color,
}) => {
  const { theme } = useUnistyles();

  return (
    <ReactNativeModal
      coverScreen
      statusBarTranslucent
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      backdropOpacity={0}
      isVisible={visible}
      style={styles.modal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator color={color || theme.colors.primary} size={size} />
          <Text style={[TextStyles.label, styles.loadingText]}>Loading...</Text>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create((theme) => ({
  modal: { margin: 0 },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.opacity50,
  },
  activityIndicatorWrapper: {
    padding: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: theme.colors.white, marginTop: ms(10) },
}));

export default FullscreenLoader;
