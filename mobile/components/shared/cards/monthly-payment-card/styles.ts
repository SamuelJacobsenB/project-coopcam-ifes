import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f8fafc",
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  content: {
    padding: 18,
    gap: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    textTransform: "capitalize",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
