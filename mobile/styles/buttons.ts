import { StyleSheet } from "react-native";

import { colors } from "./";

export const btnStyles = StyleSheet.create({
  button: {
    fontSize: 16,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  btnSm: {
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },

  btnRounded: {
    borderRadius: 999,
    padding: 6,
  },

  btnPrimary: {
    backgroundColor: colors.primary,
    color: "white",
  },
  btnSecondary: {
    backgroundColor: colors.secondary,
    color: "white",
  },
  btnSuccess: {
    backgroundColor: colors.success,
    color: "white",
  },
  btnDanger: {
    backgroundColor: colors.error,
    color: "white",
  },
  btnWarning: {
    backgroundColor: colors.warning,
    color: "white",
  },
  btnInfo: {
    backgroundColor: colors.info,
    color: "white",
  },
});
