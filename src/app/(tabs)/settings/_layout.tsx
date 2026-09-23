import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="exercises" options={{ title: "Exercises" }} />
    </Stack>
  );
}
