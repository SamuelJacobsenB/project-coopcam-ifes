import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalContent: {
    gap: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    color: "#1e293b",
    margin: 0,
  },
  hr: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    width: "100%",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#f1f5f9",
  },
  btnSecondaryText: {
    color: "#475569",
    fontWeight: "600",
  },
  btnSuccess: {
    backgroundColor: "#22c55e", // Cor verde padrão success
  },
  btnSuccessText: {
    color: "white",
    fontWeight: "600",
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
