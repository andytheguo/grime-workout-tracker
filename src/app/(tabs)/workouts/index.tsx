import { styles } from "@/constants/styles";
import { deleteRoutine, getRoutines } from "@/data/database";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Workouts() {
  const router = useRouter();

  const [routines, setRoutines] = useState<{ id: number, name: string }[]>([]);

  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      async function setup() {
        const result = await getRoutines(db);

        setRoutines(result);
      }
      setup();
    }, [db])
  );

  return (
    <View style={styles.container}>
      <View>
        <Pressable style={styles.button} onPress={() => router.navigate("/workouts/create")}>
          <Text style={styles.text}>New Routine</Text>
        </Pressable>
      </View>
      <View>
        <Text style={{ fontSize: 25 }}>Your Routines</Text>
        {routines.map((routine) => (
          <View key={routine.id}>
            <Text style={{ fontSize: 25 }}>{routine.name}</Text>

            <Pressable style={styles.button} onPress={async () => {
              await deleteRoutine(db, routine.id);

              const result = await getRoutines(db);
              setRoutines(result);
            }}>
              <Text style={styles.text}>Delete</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
