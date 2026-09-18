import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
