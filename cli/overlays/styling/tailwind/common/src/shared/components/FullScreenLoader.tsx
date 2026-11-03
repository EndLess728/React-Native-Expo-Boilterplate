import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';

import { translate } from '@/localization/utils';
import { useAppTheme } from '@/theme';

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

  return (
    <Modal statusBarTranslucent transparent animationType="fade" visible={visible}>
      <View className="flex-1 items-center justify-center bg-opacity50">
        <View className="items-center justify-center rounded-[10px] p-5">
          <ActivityIndicator color={color || theme.colors.primary} size={size} />
          <Text className="text-label font-opensans-bold mt-2.5 text-white">
            {translate('common.loading')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default FullscreenLoader;
