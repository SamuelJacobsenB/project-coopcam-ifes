import { colors } from "@/styles";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  unfocusedContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.primary,
  },
  middleContainer: {
    flexDirection: "row",
    height: 250,
  },
  focusedContainer: {
    width: 250,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
});
