import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  header: {
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    width: "100%",
    height: 80,
  },
  logo: {
    resizeMode: "contain",
  },
});
