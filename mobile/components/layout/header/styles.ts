import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  header: {
    position: "sticky",
    top: 0,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.primary,
    width: "100%",
    height: 60,
    paddingVertical: 12,
  },
  logo: {
    resizeMode: "contain",
  },
});
