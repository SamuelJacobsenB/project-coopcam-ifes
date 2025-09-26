import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export const styles = StyleSheet.create({
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.primary,
    height: 60,
    padding: 12,
  },
});
