import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
  },
});
