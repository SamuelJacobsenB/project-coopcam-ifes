import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  success: {
    backgroundColor: colors.success,
  },
  danger: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
