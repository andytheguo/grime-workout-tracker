import { styles } from "@/constants/styles";
import { getRoutine, getRoutineExercises, Routine, RoutineExercise } from "@/data/database";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function EditRoutine() {
  const { id } = useLocalSearchParams();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    async function loadRoutine() {
      const routineId = Number(id);

      const routineRes = await getRoutine(db, routineId);
      const routineExercisesRes = await getRoutineExercises(db, routineId);

      setRoutine(routineRes);
      setRoutineExercises(routineExercisesRes);
    }

    loadRoutine();
  }, [db]);

  return (
    <>
      <Stack.Screen options={{ title: routine?.name }} />

      <View style={styles.container}>
        {routineExercises.map((routineExercise) => (
          <View key={routineExercise.id}>
            <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
