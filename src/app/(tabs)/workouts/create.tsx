import { SetDraft, useRoutineDraftContext } from "@/contexts/RoutineDraftContext";
import { styles } from "@/constants/styles";
import { createRoutine, createRoutineExercise, Exercise, getExercises } from "@/data/database";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SelectorModal } from "@/components/SelectorModal";
import { DraftSetEditor } from "@/components/DraftSetEditor";

export default function CreateRoutine() {
  const router = useRouter();

  const [name, setName] = useState("");

  const { selectedExercises, setSelectedExercises, exerciseSets, setExerciseSets } = useRoutineDraftContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selecting, setSelecting] = useState(false);

  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      const result = await getExercises(db);
      setExercises(result);
    }
    setup();
  }, [db]);

  function removeExercise(exerciseId: number) {
    setSelectedExercises((oldExercises) => {
      const map = new Map(oldExercises);
      map.delete(exerciseId);
      return map;
    });
  }

  function addDraftSet(exerciseId: number) {
    setExerciseSets((oldSets) => {
      const map = new Map(oldSets);

      const sets = map.get(exerciseId);

      if (!sets) {
        throw new Error("Could not find sets associated with this exercise");
      }

      const lastIndex = sets.length - 1;
      let weight = 0;
      let reps = 0;

      if (lastIndex >= 0) {
        const lastSet = sets[lastIndex];
        weight = lastSet.weight;
        reps = lastSet.reps;
      }

      const newSet: SetDraft = {
        weight: weight,
        reps: reps,
      }

      map.set(exerciseId, [...sets, newSet]);

      return map;
    });
  }

  function saveDraftSet(exerciseId: number, index: number, weight: number, reps: number) {
    setExerciseSets((oldSets) => {
      const map = new Map(oldSets);

      const sets = map.get(exerciseId);

      if (!sets) {
        throw new Error("Could not find sets associated with this exercise");
      }

      const updatedSets = sets.map((setData, i) => i === index ? { weight: weight, reps: reps} : setData);

      map.set(exerciseId, updatedSets);

      return map;
    });
  }

  function removeDraftSet(exerciseId: number, index: number) {
    setExerciseSets((oldSets) => {
      const map = new Map(oldSets);

      const sets = map.get(exerciseId);

      if (!sets) {
        throw new Error("Could not find sets associated with this exercise");
      }

      const updatedSets = sets.filter((setData, i) => i !== index);

      map.set(exerciseId, updatedSets);

      return map;
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="white"
        onChangeText={(text) => setName(text)}
        value={name}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

      <Pressable style={styles.button} onPress={() => setSelecting(true)}>
        <Text style={styles.text}>Add Exercises</Text>
      </Pressable>

      <Text style={{ fontSize: 25 }}>Your Exercises</Text>

      {Array.from(selectedExercises.values()).map((exercise, index) => {
        const sets = exerciseSets.get(exercise.id) ?? [];

        return (
          <View key={exercise.id}>
            <Text style={{ fontSize: 25 }}>{exercise.name}</Text>
            <Pressable
              style={styles.button}
              onPress={() => removeExercise(exercise.id)}
            >
              <Text style={styles.text}>Delete</Text>
            </Pressable>

            {sets.map((set, index) => (
              <DraftSetEditor
                key={index}
                set={set}
                index={index}
                onSave={(weight, reps) => saveDraftSet(exercise.id, index, weight, reps)}
                onDelete={() => removeDraftSet(exercise.id, index)}
              />
            ))}

            <Pressable style={styles.button} onPress={() => addDraftSet(exercise.id)}>
              <Text style={styles.text}>Add Set</Text>
            </Pressable>
          </View>);
        })}

      <Pressable style={styles.button} onPress={async () => {
        async function saveRoutine() {
          const routineName = name.trim();

          if (routineName.trim() === "") return;

          const routineId = await createRoutine(db, routineName);

          for (const selected of selectedExercises.values()) {
            await createRoutineExercise(db, routineId, selected.id);
          }
        }
        await saveRoutine();
        router.back();
      }}>
        <Text style={styles.text}>Save</Text>
      </Pressable>

      <SelectorModal
        visible={selecting}
        exercises={exercises}
        onClose={() => setSelecting(false)}
      />
    </View>
  );
}
