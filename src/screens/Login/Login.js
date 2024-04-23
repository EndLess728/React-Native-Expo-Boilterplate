import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { fonts } from "@/theme";
import Constants from "expo-constants";

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
        {Constants.expoConfig.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
