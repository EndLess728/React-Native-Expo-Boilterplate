import React from "react";
import { Text, TextStyle } from "react-native";
import { NAVIGATION } from "@/constants";

const tabLabel: Record<string, string> = {
  [NAVIGATION.homeNavigator]: "Home",
  [NAVIGATION.profileNavigator]: "Profile",
};

interface TabBarLabelProps {
  color: string;
  routeName: string;
}

export function TabBarLabel({ color, routeName }: TabBarLabelProps) {
  return <Text style={{ color, fontSize: 12 }}>{tabLabel[routeName]}</Text>;
}
