import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ title: "Workouts" }} />
    </Stack>
  );
}
