import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Provider } from "@/contexts";
import { Header, Message, LoadPage, AuthGuard } from "@/components";
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
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  if (!fontsLoaded) {
    return <LoadPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <SafeAreaView style={styles.main}>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle={"light-content"}
          />
          <Header />
          <View style={styles.container}>
            <AuthGuard />
          </View>
        </SafeAreaView>

        <Message />
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
});
