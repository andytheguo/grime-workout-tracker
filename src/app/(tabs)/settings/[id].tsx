import { styles } from "@/constants/styles";
import { getExercise, updateExercse } from "@/data/database";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Edit() {
  const { id } = useLocalSearchParams();

  const [exercise, setExercise] = useState<{ id: number, name: string } | null>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    async function loadExercise() {
      const result = await getExercise(db, Number(id));
      setExercise(result);
    }

    loadExercise();
  }, [db]);

  return (
    <>
      <Stack.Screen options={{ title: exercise?.name }} />

      <View style={styles.container}>
        <TextInput
          placeholderTextColor="white"
          onChangeText={(text) => {
            if (exercise) {
              setExercise({
                ...exercise,
                name: text
              });
            }
          }}
          value={exercise?.name}
          style={{
            width: 300,
            height: 50,
            backgroundColor: "black",
            color: "white"
          }}
        />

        <Pressable style={styles.button} onPress={async () => {
          if (exercise) {
            await updateExercse(db, { id: exercise.id, name: exercise.name });
          }
        }}>
          <Text style={styles.text}>Save</Text>
        </Pressable>
      </View>
    </>
  );
}
