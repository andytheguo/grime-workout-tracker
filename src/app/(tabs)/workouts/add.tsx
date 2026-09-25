import { useRoutineDraftContext } from "@/app/contexts/RoutineDraftContext";
import { styles } from "@/constants/styles";
import { getExercises } from "@/data/database";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function AddExercises() {
  const { selectedExercises, setSelectedExercises } = useRoutineDraftContext();

  const [exercises, setExercises] = useState<{ id: number, name: string }[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      const result = await getExercises(db);
      setExercises(result);
    }
    setup();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Exercises</Text>
    </View>
  );
}
