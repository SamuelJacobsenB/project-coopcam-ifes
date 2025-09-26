import { useEffect } from "react";

import { StatusBar, View } from "react-native";

import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";

import { Header } from "@/components";
import { colors } from "@/styles";

import styles from "./styles";

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.primary);

    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar backgroundColor={colors.primary} barStyle={"light-content"} />
      <Header />
      <View style={styles.container}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}
