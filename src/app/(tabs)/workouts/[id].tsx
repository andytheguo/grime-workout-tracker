import { EditorModal } from "@/components/EditorModal";
import { SetRow } from "@/components/SetRow";
import { styles } from "@/constants/styles";
import { createRoutineExercise, createSet, deleteSet, Exercise, ExerciseSet, getExercises, getRoutine, getRoutineExercises, getSets, Routine, RoutineExercise, updateSet } from "@/data/database";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function EditRoutine() {
  const { id } = useLocalSearchParams();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  // Maps routineExercise ID to its sets
  const [sets, setSets] = useState<Map<number, ExerciseSet[]>>(new Map<number, ExerciseSet[]>());
  const [edit, setEdit] = useState(false);

  const db = useSQLiteContext();

  useEffect(() => {
    async function loadRoutine() {
      const routineId = Number(id);

      const routineRes = await getRoutine(db, routineId);
      const routineExercisesRes = await getRoutineExercises(db, routineId);
      const exercisesRes = await getExercises(db);

      setRoutine(routineRes);
      setRoutineExercises(routineExercisesRes);
      setExercises(exercisesRes);

      const map = new Map<number, ExerciseSet[]>();

      for (const routineExercise of routineExercisesRes) {
        const result = await getSets(db, routineExercise.id);

        map.set(routineExercise.id, result);
      }

      setSets(map);
    }

    loadRoutine();
  }, [db, id]);

  async function saveSet(set: ExerciseSet) {
    await updateSet(db, {
      id: set.id,
      weight: set.weight,
      reps: set.reps
    });

    setSets((oldSets) => {
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

  async function removeSet(routineExerciseId: number, setId: number) {
    await deleteSet(db, setId);

    setSets((oldSets) => {
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

  async function addSet(routineExerciseId: number) {
    await createSet(db, routineExerciseId)
    const result = await getSets(db, routineExerciseId);

    setSets((oldSets) => {
      const map = new Map<number, ExerciseSet[]>(oldSets);
      map.set(routineExerciseId, result);
      return map;
    });
  }

  async function addExercise(exercise: Exercise) {
    const routineId = Number(id);
    const routineExerciseId = await createRoutineExercise(db, routineId, exercise.id);

    const newRoutineExercise: RoutineExercise = {
      id: routineExerciseId,
      routineId: routineId,
      exerciseId: exercise.id,
      name: exercise.name
    };

    setRoutineExercises((oldRoutineExercises) => [
      ...oldRoutineExercises,
      newRoutineExercise
    ]);
  }

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
          <Text style={styles.text} onPress={() => router.navigate(`/workouts/${id}/start`)}>Start</Text>
        </Pressable>
      </View>

      <EditorModal
        routineExercises={routineExercises}
        visible={edit}
        exercises={exercises}
        sets={sets}
        onClose={() => setEdit(false)}
        onSaveSet={(set: ExerciseSet) => saveSet(set)}
        onRemoveSet={(routineExerciseId: number, setId: number) => removeSet(routineExerciseId, setId)}
        onAddSet={(routineExerciseId: number) => addSet(routineExerciseId)}
        onAddExercise={(exercise: Exercise) => addExercise(exercise)}
      />
    </>
  );
}
