import { ms } from "@/utils";
import { StyleSheet } from "react-native";
import { fonts } from "./fonts";

export const TextStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  smallText: {
    fontSize: ms(14, 0.3),
    fontFamily: fonts.openSan.semiBold,
  },
  button: {
    fontSize: ms(18, 0.3),
    fontFamily: fonts.openSan.semiBold,
  },
  error: {
    fontSize: 14,
    fontWeight: "400",
  },
});
