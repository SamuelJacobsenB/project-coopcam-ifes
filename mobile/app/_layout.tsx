import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";

import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthGuard, LoadPage, Message } from "@/components";
import { Provider } from "@/contexts";
import { colors } from "@/styles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.primary);

    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  if (!fontsLoaded) return <LoadPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <StatusBar
          backgroundColor={colors.primary}
          barStyle={"light-content"}
        />

        <View style={{ flex: 1 }}>
          <AuthGuard />
        </View>

        <Message />
      </Provider>
    </QueryClientProvider>
  );
}
