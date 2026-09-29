import { styles } from "@/constants/styles";
import { createSet, ExerciseSet, getSets, RoutineExercise } from "@/data/database";
import { Modal, Pressable, Text, View } from "react-native";
import { SetEditor } from "./SetEditor";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";

export function EditorModal({ routineExercises, visible }: { routineExercises: RoutineExercise[], visible: boolean}) {
  const [sets, setSets] = useState<Map<number, ExerciseSet[]>>(new Map<number, ExerciseSet[]>());

  const db = useSQLiteContext();

  return (
    <Modal
      visible={visible}
      animationType="slide"
    >
      {routineExercises.map((routineExercise) => {
        const exerciseSets = sets.get(routineExercise.id) ?? [];

        return (
          <View style={{ alignItems: "center" }} key={routineExercise.id}>
            <Pressable>
              <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>
            </Pressable>

            {exerciseSets.map((exerciseSet, index) => (
              <SetEditor set={exerciseSet} index={index} key={exerciseSet.id}/>
            ))}

            <Pressable
              style={styles.button}
              onPress={async () => {
                await createSet(db, routineExercise.id)
                const result = await getSets(db, routineExercise.id);

                setSets((oldSets) => {
                  const map = new Map<number, ExerciseSet[]>(oldSets);
                  map.set(routineExercise.id, result);
                  return map;
                });
              }}
            >
              <Text style={styles.text}>Add Set</Text>
            </Pressable>
          </View>
        );
      })}
    </Modal>
  );
}
