import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles";
import { routes } from "@/routes";

import styles from "../styles";

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
