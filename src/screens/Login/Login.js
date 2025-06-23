import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { fonts } from "@/theme";
import i18n from "@/localization/i18n";
export const Login = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "teal",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          color: "red",
          fontFamily: fonts.openSan.boldItalic,
        }}
      >
        {i18n.t("welcome")} {process.env.EXPO_PUBLIC_ENVIRONMENT}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
