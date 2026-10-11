import { styles } from "@/constants/styles";
import { createExercise, deleteExercise, Exercise, getExercises } from "@/data/database";
import { useFocusEffect, useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Exercises() {
  const router = useRouter();

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

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
    <SafeAreaView style={{ flex: 1, marginTop: headerHeight - insets.top }}>
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
            color: "white",
            marginBottom: 10
          }}
        />

        <Pressable style={[styles.button, { marginBottom: 20 }]} onPress={() => {
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

        <ScrollView>
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
        </ScrollView>
      </View>
    </SafeAreaView>
   );
}
