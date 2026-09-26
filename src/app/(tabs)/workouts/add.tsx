import { useRoutineDraftContext } from "@/contexts/RoutineDraftContext";
import { styles } from "@/constants/styles";
import { Exercise, getExercises } from "@/data/database";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";

export default function AddExercises() {
  const router = useRouter();

  const { selectedExercises, setSelectedExercises } = useRoutineDraftContext();

  function toggleExercise(exercise: Exercise) {
    setSelectedExercises((current) => {
      const set = new Map(current);
      current.has(exercise.id) ? set.delete(exercise.id) : set.set(exercise.id, exercise);
      return set;
    });
  }

  const [exercises, setExercises] = useState<Exercise[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      const result = await getExercises(db);
      setExercises(result);
    }
    setup();
  }, [db]);

  return (
    <View style={styles.container}>
      {exercises.map((exercise) => {
        return (
          <View key={exercise.id}>
            <Checkbox
              value={selectedExercises.has(exercise.id)}
              onValueChange={() => toggleExercise(exercise)}
            />
            <Text style={{ fontSize: 25 }}>{exercise.name}</Text>
          </View>
        );
      })}

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.text}>Done</Text>
      </Pressable>
    </View>
  );
}
