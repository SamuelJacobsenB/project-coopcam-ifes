import React from "react";

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components";

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
