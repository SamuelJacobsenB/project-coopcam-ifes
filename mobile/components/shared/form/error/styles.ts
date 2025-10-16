import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  error: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.error,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  errorText: {
    flex: 1,
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  close: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
});
