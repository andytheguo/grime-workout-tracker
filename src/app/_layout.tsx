import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ title: "Home" }}/>
      <Stack.Screen name="progress" options={{ title: "Progress" }}/>
      <Stack.Screen name="workouts" options={{ title: "Workouts" }}/>
    </Stack>
  );
}
