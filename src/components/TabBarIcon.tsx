import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { homeIcon, settingsIcon } from "@/assets";
import { NAVIGATION } from "@/constants";

const tabIcon: Record<string, ImageSourcePropType> = {
  [NAVIGATION.homeNavigator]: homeIcon,
  [NAVIGATION.profileNavigator]: settingsIcon,
};

interface TabBarIconProps {
  color: string;
  routeName: string;
}

export function TabBarIcon({ color, routeName }: TabBarIconProps) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      source={tabIcon[routeName]}
      style={{ tintColor: color }}
    />
  );
}
