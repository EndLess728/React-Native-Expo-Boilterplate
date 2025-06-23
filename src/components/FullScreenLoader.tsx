import { TextStyles } from "@/theme";
import { ms } from "@/utils";
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import ReactNativeModal from "react-native-modal";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface FullscreenLoaderProps {
  visible: boolean;
  size?: "small" | "large";
  color?: string;
}

const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  visible = false,
  size = "large",
  color,
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ReactNativeModal
      // backdropColor="black"
      backdropOpacity={0}
      isVisible={visible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      statusBarTranslucent
      coverScreen
      style={{ margin: 0 }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size={size}
            color={color || theme.colors.primary}
          />
          <Text style={[TextStyles.label, styles.loadingText]}>Loading...</Text>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const stylesheet = createStyleSheet((theme, rt) => ({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000060",
  },
  activityIndicatorWrapper: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: theme.colors.white, marginTop: ms(10) },
}));

export default FullscreenLoader;
