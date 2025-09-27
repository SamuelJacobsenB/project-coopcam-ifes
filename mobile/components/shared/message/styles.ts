import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  message: {
    zIndex: 1000,
    position: "absolute",
    bottom: 84,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  success: {
    backgroundColor: colors.success,
  },
  error: {
    backgroundColor: colors.error,
  },
  icon: {
    color: "white",
  },
  text: {
    flexShrink: 1,
    color: "white",
  },
  close: {
    marginLeft: 8,
  },
});
