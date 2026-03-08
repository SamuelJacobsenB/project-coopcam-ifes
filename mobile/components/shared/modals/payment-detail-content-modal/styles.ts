import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 4,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 24,
    textAlign: "center",
  },

  // --- Estilos do QR Code ---
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    // Sombras leves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  qrHint: {
    marginTop: 12,
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },

  // --- Info Card ---
  infoContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    color: "#1e293b",
    fontWeight: "700",
    fontSize: 16,
  },

  // --- Botões ---
  actions: {
    gap: 12,
  },
  pixButton: {
    backgroundColor: "#16a34a", // Verde PIX mais sóbrio
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  linkButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  linkButtonText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 15,
  },

  // --- Estado de Pago ---
  paidMessage: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successIconBadge: {
    marginBottom: 12,
  },
  paidTextTitle: {
    color: "#15803d",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 4,
  },
  paidTextSubtitle: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
