import { styles } from "@/constants/styles";
import { deleteRoutine, getRoutines, Routine } from "@/data/database";
import { useFocusEffect, useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Workouts() {
  const router = useRouter();

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [routines, setRoutines] = useState<Routine[]>([]);

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
    <SafeAreaView style={{ flex: 1, marginTop: headerHeight - insets.top }}>
      <View style={styles.container}>
          <Pressable style={[styles.button, { marginBottom: 10 }]} onPress={() => router.navigate("/workouts/create")}>
            <Text style={styles.text}>New Routine</Text>
          </Pressable>

          <Text style={{ fontSize: 25, marginBottom: 20 }}>Your Routines:</Text>

          <ScrollView>
            {routines.map((routine) => (
              <View key={routine.id}>
                <Pressable onPress={() => router.navigate(`/workouts/${routine.id}`)}>
                  <Text style={{ fontSize: 25 }}>{routine.name}</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={async () => {
                  await deleteRoutine(db, routine.id);

                  const result = await getRoutines(db);
                  setRoutines(result);
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
