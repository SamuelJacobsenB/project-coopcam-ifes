import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 4,
  },
  unavailable: {
    backgroundColor: colors.gray,
    margin: 0,
    borderRadius: 0,
  },
  unavailableText: {
    color: colors.primary,
    opacity: 0.6,
  },
  override: {
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  overrideText: {
    color: "#fff",
    fontWeight: "600",
  },
  selected: {
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },
});
