import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";

import { useFonts } from "expo-font";
import * as SystemUI from "expo-system-ui";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Provider } from "@/contexts";
import { Message, LoadPage, AuthGuard } from "@/components";
import { colors } from "@/styles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
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
  }, []);

  if (!fontsLoaded) return <LoadPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        {/* Removido o SafeAreaView e o Header daqui */}
        <StatusBar
          backgroundColor={colors.primary}
          barStyle={"light-content"}
        />

        {/* O AuthGuard */}
        <View style={{ flex: 1 }}>
          <AuthGuard />
        </View>

        <Message />
      </Provider>
    </QueryClientProvider>
  );
}
