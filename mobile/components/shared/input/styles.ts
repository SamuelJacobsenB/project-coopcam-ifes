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
    color: "#333",
  },
  input: {
    fontSize: 16,
    backgroundColor: colors.gray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
