import { StyleSheet } from "react-native";

export default StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 4,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalArea: {
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-start",
  },
  close: {
    backgroundColor: "white",
    padding: 4,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 16,
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
  },
});
