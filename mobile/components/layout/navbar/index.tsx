export function Navbar() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007bff",
        tabBarStyle: { backgroundColor: "#fff" },
      }}
    >
      {routes.map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: route.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={route.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
