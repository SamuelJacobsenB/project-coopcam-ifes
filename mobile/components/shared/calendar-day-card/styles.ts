import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    alignItems: "center",
    fontFamily: "Poppins-Bold",
  },
  headerDate: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    flexShrink: 1,
  },
});
