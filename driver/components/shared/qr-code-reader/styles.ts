import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    width: "100%",
    aspectRatio: 1,
    padding: 32,
    borderRadius: 12,
  },
});
