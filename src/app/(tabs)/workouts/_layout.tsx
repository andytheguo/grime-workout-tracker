import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "Workouts" }} />
      <Stack.Screen name="create" options={{ title: "Create Routine" }} />
      <Stack.Screen name="add" options={{ title: "Add Exercises" }} />
    </Stack>
  );
}
