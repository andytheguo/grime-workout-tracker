import { ExerciseContextProvider } from "@/contexts/ExerciseContext";
import { RoutineDraftProvider } from "@/contexts/RoutineDraftContext";
import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <ExerciseContextProvider>
      <RoutineDraftProvider>
        <Stack screenOptions={{ headerTransparent: true, headerBackButtonDisplayMode: "minimal" }}>
          <Stack.Screen name="index" options={{ title: "Workouts" }} />
          <Stack.Screen name="create" options={{ title: "Create Routine" }} />
        </Stack>
      </RoutineDraftProvider>
    </ExerciseContextProvider>
  );
}
