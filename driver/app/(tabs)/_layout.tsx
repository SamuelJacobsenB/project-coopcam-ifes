import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { Slot } from "expo-router";

import { Header } from "@/components";

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Slot />
    </SafeAreaView>
  );
}
