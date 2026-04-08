import React from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import FullscreenLoader from '@/components/FullScreenLoader';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showLoader?: boolean;
  scrollable?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style = {},
  showLoader = false,
  scrollable = false,
}) => {
  if (scrollable) {
    return (
      <>
        <View style={styles.wrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            style={[styles.container, style]}
          >
            {children}
          </ScrollView>
        </View>
        <FullscreenLoader visible={showLoader} />
      </>
    );
  }

  return (
    <>
      <View style={styles.wrapper}>
        <View style={[styles.container, style]}>{children}</View>
      </View>
      <FullscreenLoader visible={showLoader} />
    </>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.white, // fallback background
  },
  container: {
    flex: 1,
    paddingBottom: rt.insets.bottom,
  },
  scrollContainer: {
    flexGrow: 1,
  },
}));
