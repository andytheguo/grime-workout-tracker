import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerTransparent: true }}>
      <Tabs.Screen name="home" options={{ headerShown: false}} />
      <Tabs.Screen name="progress" options={{ headerShown: false}} />
      <Tabs.Screen name="workouts" options={{ headerShown: false }} />
      <Tabs.Screen name="settings" options={{ headerShown: false }} />
    </Tabs>
  );
}
