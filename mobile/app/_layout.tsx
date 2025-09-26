import { View } from "react-native";

import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Header } from "@/components";

import { styles } from "./styles";

export default function RootLayout() {
  return (
    <View style={styles.main}>
      <Header />
      <Slot />
      <Stack>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
