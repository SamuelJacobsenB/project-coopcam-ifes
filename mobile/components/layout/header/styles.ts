import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.primary,
    width: "100%",
    height: 60,
    padding: 12,
  },
  logo: {
    width: "auto",
    height: 30,
  },
});
