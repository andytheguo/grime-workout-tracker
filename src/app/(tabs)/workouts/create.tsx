import { toggleExercise, useRoutineDraftContext } from "@/contexts/RoutineDraftContext";
import { styles } from "@/constants/styles";
import { createRoutine, createRoutineExercise } from "@/data/database";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function CreateRoutine() {
  const router = useRouter();

  const [name, setName] = useState("");

  const { selectedExercises, setSelectedExercises } = useRoutineDraftContext();

  const db = useSQLiteContext();

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

      <Pressable style={styles.button} onPress={() => router.navigate("/workouts/add")}>
        <Text style={styles.text}>Add Exercises</Text>
      </Pressable>

      <Text style={{ fontSize: 25 }}>Your Exercises</Text>

      {Array.from(selectedExercises.values()).map((exercise) => (
        <View key={exercise.id}>
          <Text>{exercise.name}</Text>
          <Pressable
            style={styles.button}
            onPress={() => setSelectedExercises((selected) => toggleExercise(selected, exercise))}
          >
            <Text style={{ color: "white" }}>Delete</Text>
          </Pressable>
        </View>
      ))}

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
    </View>
  );
}
