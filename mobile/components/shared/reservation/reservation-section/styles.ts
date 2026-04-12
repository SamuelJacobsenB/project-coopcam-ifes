import { StyleSheet } from "react-native";

export default StyleSheet.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#555",
  },
  statusContainer: {
    flexDirection: "column",
    gap: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reservationText: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#8E8E93",
  },
  textReserved: {
    color: "#1C1C1E",
  },
});
