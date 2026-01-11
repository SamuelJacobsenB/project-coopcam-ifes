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
    // Sombra mais destacada para todos os cards (ativo por padrão)
    shadowColor: colors.primary + "40", // Cor primária com transparência
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    // Sombra para Android
    elevation: 8,
    borderWidth: 2.5,
    borderColor: colors.primary, // Todos com borda primária
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: colors.primary, // Todos com fundo primário
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary + "80", // Borda inferior sutil
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white", // Sempre branco
    letterSpacing: 0.8,
    opacity: 0.95,
  },
  dateText: {
    fontSize: 28,
    fontWeight: "900",
    color: "white", // Sempre branco
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
    backgroundColor: "#f9fafb", // Fundo sutil para o rodapé
  },
  indicator: {
    width: 36,
    height: 5,
    backgroundColor: colors.primary + "80", // Indicador na cor primária com transparência
    borderRadius: 3,
  },
});
