import { styles } from "@/constants/styles";
import { getExercise } from "@/data/database";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: exercise?.name }} />
      <View style={styles.container}>
        <Text>{exercise?.name}</Text>
      </View>
    </>
  );
}
