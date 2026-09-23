import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
