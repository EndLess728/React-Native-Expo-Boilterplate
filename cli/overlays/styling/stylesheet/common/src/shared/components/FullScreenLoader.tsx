import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';

import { translate } from '@/localization/utils';
import { ms } from '@/shared/utils';
import { makeStyles, TextStyles, useAppTheme } from '@/theme';

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
  const theme = useAppTheme();
  const styles = useStyles();

  return (
    <Modal statusBarTranslucent transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator color={color || theme.colors.primary} size={size} />
          <Text style={[TextStyles.label, styles.loadingText]}>{translate('common.loading')}</Text>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
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
