import { EditorModal } from "@/components/EditorModal";
import { SetRow } from "@/components/SetRow";
import { styles } from "@/constants/styles";
import { ExerciseSet, getRoutine, getRoutineExercises, getSets, Routine, RoutineExercise } from "@/data/database";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function EditRoutine() {
  const { id } = useLocalSearchParams();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [sets, setSets] = useState<Map<number, ExerciseSet[]>>(new Map<number, ExerciseSet[]>());
  const [edit, setEdit] = useState(false);

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

      setSets(map);
    }

    loadRoutine();
  }, [db, id]);

  return (
    <>
      <Stack.Screen options={{ title: routine?.name }} />

      <View style={styles.container}>
        <Pressable style={styles.button} onPress={() => setEdit(true)}>
          <Text style={styles.text}>Edit Routine</Text>
        </Pressable>

        {routineExercises.map((routineExercise) => {
          const exerciseSets = sets.get(routineExercise.id) ?? [];

          return (
            <View style={{ alignItems: "center" }} key={routineExercise.id}>
              <Pressable>
                <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>
              </Pressable>

              {exerciseSets.map((exerciseSet, index) => (
                <SetRow set={exerciseSet} index={index} key={exerciseSet.id}/>
              ))}
            </View>
          );
        })}

        <Pressable style={styles.button}>
          <Text style={styles.text}>Start</Text>
        </Pressable>
      </View>

      <EditorModal
        routineExercises={routineExercises}
        visible={edit}
        sets={sets}
        setSets={setSets}
        onClose={() => setEdit(false)}
      />
    </>
  );
}
