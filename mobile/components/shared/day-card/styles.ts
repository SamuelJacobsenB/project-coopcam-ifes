import { colors } from "@/styles";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dayCard: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    gap: 12,
    backgroundColor: "white",
    width: 150,
    height: 280,
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  dayCardFixedInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray,
    color: "white",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dayCardBody: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
