import React, { FC, ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { TextStyles } from "@/theme";
import { ms } from "@/utils";

type ButtonTypes = "primary" | "secondary" | "disabled";

interface ButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  title: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type: ButtonTypes;
}

const Button: FC<ButtonProps> = ({
  style = {},
  textStyle = {},
  isLoading = false,
  title,
  disabled = false,
  leftIcon,
  rightIcon,
  type = "primary",
  ...rest
}) => {
  // Style maps for reusability and scalability
  const buttonTypeStyles: Record<ButtonTypes, ViewStyle> = {
    primary: styles.primary,
    secondary: styles.secondary,
    disabled: styles.disabled,
  };

  const textTypeStyles: Record<ButtonTypes, TextStyle> = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    disabled: styles.disabledText,
  };

  // Button is considered disabled if explicitly set or if loading
  const isButtonDisabled = disabled || isLoading || type === "disabled";

  return (
    <TouchableOpacity
      style={[buttonTypeStyles[type], style]}
      disabled={isButtonDisabled}
      {...rest}
    >
      {isLoading ? (
        // Loading spinner when button is in loading state
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <View style={styles.contentRow}>
          {/* Optional left icon */}
          {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}

          {/* Button title */}
          <Text style={[textTypeStyles[type], TextStyles.button, textStyle]}>
            {title}
          </Text>

          {/* Optional right icon */}
          {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primary: {
    width: "100%",
    borderRadius: ms(28),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(16),
    marginBottom: ms(24),
    backgroundColor: "#000",
  },
  secondary: {
    width: "100%",
    borderRadius: ms(28),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(16),
    marginBottom: ms(24),
    borderColor: "#000", // Added border color for clarity
    backgroundColor: "transparent",
  },
  disabled: {
    width: "100%",
    borderRadius: ms(28),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(17.5),
    marginBottom: ms(24),
    backgroundColor: "#00000020",
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
  },
  secondaryText: {
    color: "#000",
    textAlign: "center",
  },
  disabledText: {
    color: "#00000040",
    textAlign: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginHorizontal: ms(8),
  },
});

export default Button;
