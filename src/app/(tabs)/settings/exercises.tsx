import { styles } from "@/constants/styles";
import { createExercise, deleteExercise, getExercises } from "@/data/database";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Exercises() {
  const router = useRouter();

  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState<{ id: number, name: string }[]>([]);

  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        const result = await getExercises(db);
        setExercises(result);
      }
      setup();
    }, [db])
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Exercise name"
        placeholderTextColor="white"
        onChangeText={setExerciseName}
        value={exerciseName}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

      <Pressable style={styles.button} onPress={() => {
        async function addExercise() {
          const name = exerciseName.trim();

          if (name === "") return;

          await createExercise(db, exerciseName);
          setExerciseName("");

          const result = await getExercises(db);
          setExercises(result);
        }

        addExercise();
      }}>
        <Text style={styles.text}>Add Exercise</Text>
      </Pressable>

      {exercises.map((exercise) => (
        <View key={exercise.id}>
          <Pressable onPress={() => router.navigate(`/settings/${exercise.id}`)}>
            <Text style={{ fontSize: 25 }}>{exercise.name}</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={async () => {
            await deleteExercise(db, exercise.id);

            const result = await getExercises(db);
            setExercises(result);
          }}>
            <Text style={styles.text}>Delete</Text>
          </Pressable>
        </View>
      ))}
    </View>
   );
}
