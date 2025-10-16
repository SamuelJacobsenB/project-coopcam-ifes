import { StyleSheet } from "react-native";

import { colors } from "@/styles";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  check: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray,
  },
  checked: {
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
});
