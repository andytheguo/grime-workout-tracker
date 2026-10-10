import { SelectorModal } from "@/components/SelectorModal";
import { SetLogger } from "@/components/SetLogger";
import { styles } from "@/constants/styles";
import { Exercise, ExerciseSet, getRoutine, getRoutineExercises, getSets, Routine, RoutineExercise } from "@/data/database";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function StartRoutine() {
  const { id } = useLocalSearchParams();

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [activeRoutineExercises, setActiveRoutineExercises] = useState<RoutineExercise[]>([]);
  const tempId = useRef(-1);

  // Maps routineExercise ID to its sets
  const [activeSets, setActiveSets] = useState<Map<number, ExerciseSet[]>>(new Map<number, ExerciseSet[]>());
  const [selectedExercises, setSelectedExercises] = useState<Map<number, Exercise>>(new Map());

  const [selecting, setSelecting] = useState(false);

  const db = useSQLiteContext();

  useEffect(() => {
    async function loadRoutine() {
      const routineId = Number(id);

      const routineRes = await getRoutine(db, routineId);
      const routineExercisesRes = await getRoutineExercises(db, routineId);

      setRoutine(routineRes);
      setActiveRoutineExercises(routineExercisesRes);

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

  function addActiveRoutineExercise(exercise: Exercise) {
    const routineId = Number(id);

    const routineExerciseId = tempId.current--;
    const setId = tempId.current--;

    const newRoutineExercise: RoutineExercise = {
      id: routineExerciseId,
      routineId: routineId,
      exerciseId: exercise.id,
      name: exercise.name
    }

    setActiveRoutineExercises((oldExercises) => [
      ...oldExercises,
      newRoutineExercise
    ]);

    const newSet: ExerciseSet = {
      id: setId,
      weight: 0,
      reps: 0,
      routineExerciseId: routineExerciseId
    };

    setActiveSets((oldSets) => {
      const map = new Map(oldSets);
      map.set(routineExerciseId, [newSet]);
      return map;
    });
  }

  function toggleExercise(exercise: Exercise) {
    setSelectedExercises((oldExercises) => {
      const exerciseMap = new Map(oldExercises);

      if (exerciseMap.has(exercise.id)) {
        exerciseMap.delete(exercise.id);
      }
      else {
        exerciseMap.set(exercise.id, exercise);
      }

      return exerciseMap;
    });
  }

  function addSelected() {
    for (const exercise of selectedExercises.values()) {
      addActiveRoutineExercise(exercise);
    }

    setSelectedExercises(new Map());
  }

  function removeActiveRoutineExercise(routineExerciseId: number) {
    setActiveRoutineExercises((oldExercises) => oldExercises.filter((routineExercise) => routineExercise.id !== routineExerciseId));
    setActiveSets((oldSets) => {
      const map = new Map(oldSets);
      map.delete(routineExerciseId);
      return map;
    })
  }

  return (
    <>
      <Stack.Screen options={{ title: routine?.name }} />

      <SafeAreaView style={{ flex: 1, marginTop: headerHeight - insets.top }}>
        <View style={styles.container}>
          <ScrollView>
            {activeRoutineExercises.map((routineExercise) => {
              const exerciseSets = activeSets.get(routineExercise.id) ?? [];

              return (
                <View style={{ alignItems: "center" }} key={routineExercise.id}>
                  <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>

                  <Pressable style={styles.button} onPress={() => removeActiveRoutineExercise(routineExercise.id)}>
                    <Text style={styles.text}>Delete Exercise</Text>
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
          </ScrollView>

          <Pressable style={[styles.button, { marginTop: 20, marginBottom: 10 }]} onPress={() => setSelecting(true)}>
            <Text style={styles.text}>Add Exercise</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.text}>Finish</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <SelectorModal
        visible={selecting}
        selectedExercises={selectedExercises}
        onToggle={(exercise: Exercise) => toggleExercise(exercise)}
        onClose={() => {
          addSelected();
          setSelecting(false);
        }}
      />
    </>
  );
}
