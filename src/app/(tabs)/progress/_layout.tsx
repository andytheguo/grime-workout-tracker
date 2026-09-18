import { Stack } from "expo-router";

export default function ProgressLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ title: "Progress" }} />
    </Stack>
  );
}
