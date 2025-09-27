import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { routes } from "@/routes";
import { colors } from "@/styles";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: colors.secondary,
        tabBarStyle: styles.navbar,
      }}
    >
      {routes.map(({ name, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={icon}
                size={name === "(home)/index" || focused ? size + 6 : size}
                color={color}
                style={
                  name === "(home)/index" || focused
                    ? { marginBottom: -4 }
                    : undefined
                }
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.primary,
    color: "white",
    height: 60,
    paddingTop: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
});
