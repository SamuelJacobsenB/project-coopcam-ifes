import { colors } from "@/styles";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dayCard: {
    backgroundColor: "white",
    width: 150,
    height: 270,
    borderRadius: 20,
    overflow: "hidden",
    margin: 8,
    shadowColor: colors.primary + "40",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,

    elevation: 8,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: colors.primary,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary + "80",
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.8,
    opacity: 0.95,
  },
  dateText: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    marginTop: 6,
  },
  dayCardBody: {
    flex: 1,
    padding: 18,
    gap: 10,
    backgroundColor: "#ffffff",
  },
  footer: {
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 4,
    backgroundColor: "#f9fafb",
  },
  indicator: {
    width: 36,
    height: 5,
    backgroundColor: colors.primary + "80",
    borderRadius: 3,
  },
});
