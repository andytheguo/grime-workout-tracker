import { styles } from "@/constants/styles";
import { createSet, deleteSet, ExerciseSet, getSets, RoutineExercise, updateSet } from "@/data/database";
import { Modal, Pressable, Text, View } from "react-native";
import { SetEditor } from "./SetEditor";
import { useSQLiteContext } from "expo-sqlite";
import { Dispatch, SetStateAction } from "react";

interface EditorModalProps {
  routineExercises: RoutineExercise[],
  visible: boolean,
  sets: Map<number, ExerciseSet[]>,
  setSets: Dispatch<SetStateAction<Map<number, ExerciseSet[]>>>,
  onClose: () => void
};

export function EditorModal({
  routineExercises,
  visible,
  sets,
  setSets,
  onClose
}: EditorModalProps) {
  const db = useSQLiteContext();

  async function saveSet(set: ExerciseSet) {
    await updateSet(db, {
      id: set.id,
      weight: set.weight,
      reps: set.reps
    });

    setSets((oldSets) => {
      const map = new Map(oldSets);

      const exerciseSets = map.get(set.routineExerciseId);

      if (!exerciseSets) {
        throw new Error("Could not find exercises associated with this routine");
      }

      const updatedSets = exerciseSets.map((setData) => setData.id === set.id ? { ...setData, weight: set.weight, reps: set.reps} : setData);

      map.set(set.routineExerciseId, updatedSets);

      return map;
    });
  }

  async function removeSet(routineExerciseId: number, setId: number) {
    await deleteSet(db, setId);

    setSets((oldSets) => {
      const map = new Map(oldSets);

      const exerciseSets = map.get(routineExerciseId);

      if (!exerciseSets) {
        throw new Error("Could not find exercises associated with this routine");
      }

      const updatedSets = exerciseSets.filter((setData) => setData.id !== setId);

      map.set(routineExerciseId, updatedSets);

      return map;
    });
  }

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      animationType="slide"
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.text}>Close</Text>
        </Pressable>

        {routineExercises.map((routineExercise) => {
          const exerciseSets = sets.get(routineExercise.id) ?? [];

          return (
            <View key={routineExercise.id}>
              <Pressable>
                <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>
              </Pressable>

              {exerciseSets.map((exerciseSet, index) => (
                <SetEditor
                  key={exerciseSet.id}
                  set={exerciseSet}
                  index={index}
                  onSave={(weight, reps) => saveSet({
                    ...exerciseSet,
                    weight: weight,
                    reps: reps,
                  })}
                  onDelete={() => removeSet(routineExercise.id, exerciseSet.id)}
                />
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
      </View>
    </Modal>
  );
}
