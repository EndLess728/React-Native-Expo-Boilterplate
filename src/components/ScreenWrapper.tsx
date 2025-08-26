import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import FullscreenLoader from "./FullScreenLoader";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showLoader?: boolean;
  scrollable?: boolean;
  showBackgroundShape?: boolean; // toggle the SVG background
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style = {},
  showLoader = false,
  scrollable = false,
}) => {
  const { theme } = useUnistyles();

  if (scrollable) {
    return (
      <>
        <View style={styles.wrapper}>
          <ScrollView
            style={[styles.container, style]}
            contentContainerStyle={styles.scrollContainer}
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
  backgroundShape: {
    ...StyleSheet.absoluteFillObject, // fill the entire wrapper
    zIndex: -1, // send it behind all other content
  },
}));
