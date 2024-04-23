import PropTypes from "prop-types";
import React from "react";
import { Image, Text } from "react-native";
import { homeIcon, settingsIcon } from "@/assets";
import { NAVIGATION } from "@/constants";

const tabLabel = {
  [NAVIGATION.homeNavigator]: "Home",
  [NAVIGATION.profileNavigator]: "Profile",
};

export function TabBarLabel({ color, routeName }) {
  return (
    <Text style={{ color: color, fontSize: 12 }}>{tabLabel[routeName]}</Text>
  );
}

TabBarLabel.propTypes = {
  color: PropTypes.string.isRequired,
  routeName: PropTypes.string.isRequired,
};
