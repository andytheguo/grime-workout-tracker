import { Stack } from "expo-router";

export default function ProgressLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "Progress" }} />
    </Stack>
  );
}
