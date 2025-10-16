import { colors } from "@/styles";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  inputArea: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  input: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    backgroundColor: colors.gray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
