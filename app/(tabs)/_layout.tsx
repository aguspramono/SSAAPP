import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Stack } from "expo-router";

function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3db61b",
        tabBarActiveBackgroundColor: "#eaeefd",
        tabBarStyle: {
          backgroundColor: "#f1f4ff",
          height: 60,
        },
        tabBarItemStyle: {
          borderRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="home" color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="pegawai"
        options={{
          title: "Pegawai",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="users" color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={22} name="user" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
