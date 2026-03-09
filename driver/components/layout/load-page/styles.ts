import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  loadPage: {
    zIndex: 1500,
    position: "fixed",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
});
