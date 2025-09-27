import { FlatList, StyleSheet, Text, View } from "react-native";

import { Line } from "@/components";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferêrcia semanal</Text>
      <Line style={styles.line} />
      {/* <FlatList data={} renderItem={}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    width: "100%",
  },
  line: {
    marginBottom: 24,
  },
});
