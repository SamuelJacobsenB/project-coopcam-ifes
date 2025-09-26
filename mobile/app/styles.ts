import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.primary,
    color: "white",
    height: 60,
    paddingTop: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
});
