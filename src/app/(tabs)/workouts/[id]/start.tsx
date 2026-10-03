import { SetLogger } from "@/components/SetLogger";
import { styles } from "@/constants/styles";
import { ExerciseSet, getRoutine, getRoutineExercises, getSets, Routine, RoutineExercise } from "@/data/database";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function StartRoutine() {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  // Maps routineExercise ID to its sets
  const [activeSets, setActiveSets] = useState<Map<number, ExerciseSet[]>>(new Map<number, ExerciseSet[]>());

  const db = useSQLiteContext();

  useEffect(() => {
    async function loadRoutine() {
      const routineId = Number(id);

      const routineRes = await getRoutine(db, routineId);
      const routineExercisesRes = await getRoutineExercises(db, routineId);

      setRoutine(routineRes);
      setRoutineExercises(routineExercisesRes);

      const map = new Map<number, ExerciseSet[]>();

      for (const routineExercise of routineExercisesRes) {
        const result = await getSets(db, routineExercise.id);

        map.set(routineExercise.id, result);
      }

      setActiveSets(map);
    }

    loadRoutine();
  }, [db, id]);

  function saveActiveSet(set: ExerciseSet) {
    setActiveSets((oldSets) => {
      const map = new Map(oldSets);

      const exerciseSets = map.get(set.routineExerciseId);

      if (!exerciseSets) {
        throw new Error("Could not find sets associated with this routine");
      }

      const updatedSets = exerciseSets.map((setData) => setData.id === set.id ? { ...setData, weight: set.weight, reps: set.reps} : setData);

      map.set(set.routineExerciseId, updatedSets);

      return map;
    });
  }

  function addActiveSet(routineExerciseId: number) {
    setActiveSets((oldSets) => {
      const map = new Map(oldSets);

      const exerciseSets = map.get(routineExerciseId);

      if (!exerciseSets) {
        throw new Error("Could not find sets associated with this routine");
      }

      const lastIndex = exerciseSets.length - 1;
      let weight = 0;
      let reps = 0;

      if (lastIndex >= 0) {
        const lastSet = exerciseSets[lastIndex];
        weight = lastSet.weight;
        reps = lastSet.reps;
      }

      const newSet: ExerciseSet = {
        id: -Date.now(), // Negative temp ID so no clashes
        weight: weight,
        reps: reps,
        routineExerciseId: routineExerciseId
      }

      map.set(routineExerciseId, [...exerciseSets, newSet]);

      return map;
    });
  }

  function removeActiveSet(routineExerciseId: number, setId: number) {
    setActiveSets((oldSets) => {
      const map = new Map(oldSets);

      const exerciseSets = map.get(routineExerciseId);

      if (!exerciseSets) {
        throw new Error("Could not find sets associated with this routine");
      }

      const updatedSets = exerciseSets.filter((setData) => setData.id !== setId);

      map.set(routineExerciseId, updatedSets);

      return map;
    });
  }

  return (
    <>
      <Stack.Screen options={{ title: routine?.name }} />

      <View style={styles.container}>
        {routineExercises.map((routineExercise) => {
          const exerciseSets = activeSets.get(routineExercise.id) ?? [];

          return (
            <View style={{ alignItems: "center" }} key={routineExercise.id}>
              <Pressable>
                <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>
              </Pressable>

              {exerciseSets.map((exerciseSet, index) => (
                <SetLogger
                  key={exerciseSet.id}
                  set={exerciseSet}
                  index={index}
                  onSave={(weight, reps) => saveActiveSet({
                    ...exerciseSet,
                    weight: weight,
                    reps: reps
                  })}
                  onDelete={() => removeActiveSet(routineExercise.id, exerciseSet.id)}
                />
              ))}

              <Pressable style={styles.button} onPress={() => addActiveSet(routineExercise.id)}>
                <Text style={styles.text}>Add Set</Text>
              </Pressable>
            </View>
          );
        })}

        <Pressable style={styles.button}>
          <Text style={styles.text}>Add Exercise</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.text}>Finish</Text>
        </Pressable>
      </View>
    </>
  );
}
