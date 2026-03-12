import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainContent: {
    flexDirection: "column",
    gap: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  routeText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 28,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeGo: {
    backgroundColor: "#ecfdf5",
  },
  badgeBack: {
    backgroundColor: "#eff6ff",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgeTextGo: {
    color: "#047857",
  },
  badgeTextBack: {
    color: "#1d4ed8",
  },
});
