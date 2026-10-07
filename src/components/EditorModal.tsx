import { styles } from "@/constants/styles";
import { Exercise, ExerciseSet, RoutineExercise } from "@/data/database";
import { Modal, Pressable, Text, View } from "react-native";
import { SetEditor } from "./SetEditor";
import { SelectorModal } from "./SelectorModal";
import { useState } from "react";

interface EditorModalProps {
  routineExercises: RoutineExercise[],
  visible: boolean,
  exercises: Exercise[]
  sets: Map<number, ExerciseSet[]>,
  onClose: () => void,
  onSaveSet: (set: ExerciseSet) => void,
  onRemoveSet: (routineExerciseId: number, setId: number) => void,
  onAddSet: (routineExerciseId: number) => void,
  onAddExercise: (exercise: Exercise) => void,
  onRemoveExercise: (routineExerciseId: number) => void
};

export function EditorModal({
  routineExercises,
  visible,
  sets,
  onClose,
  onSaveSet,
  onRemoveSet,
  onAddSet,
  onAddExercise,
  onRemoveExercise
}: EditorModalProps) {
  const [selecting, setSelecting] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Map<number, Exercise>>(new Map());

  function addSelected() {
    for (const exercise of selectedExercises.values()) {
      onAddExercise(exercise);
    }

    setSelectedExercises(new Map());
  }

  function toggleExercise(exercise: Exercise) {
    setSelectedExercises((oldExercises) => {
      const exerciseMap = new Map(oldExercises);

      if (exerciseMap.has(exercise.id)) {
        exerciseMap.delete(exercise.id);
      }
      else {
        exerciseMap.set(exercise.id, exercise);
      }

      return exerciseMap;
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
              <Text style={{ fontSize: 25 }}>{routineExercise.name}</Text>

              <Pressable style={styles.button} onPress={() => onRemoveExercise(routineExercise.id)}>
                <Text style={styles.text}>Delete Exercise</Text>
              </Pressable>

              {exerciseSets.map((exerciseSet, index) => (
                <SetEditor
                  key={exerciseSet.id}
                  set={exerciseSet}
                  index={index}
                  onSave={(weight, reps) => onSaveSet({
                    ...exerciseSet,
                    weight: weight,
                    reps: reps,
                  })}
                  onDelete={() => onRemoveSet(routineExercise.id, exerciseSet.id)}
                />
              ))}

              <Pressable
                style={styles.button}
                onPress={() => onAddSet(routineExercise.id)}
              >
                <Text style={styles.text}>Add Set</Text>
              </Pressable>
            </View>
          );
        })}

        <Pressable style={styles.button} onPress={() => setSelecting(true)}>
          <Text style={styles.text}>Add Exercise</Text>
        </Pressable>
      </View>

      <SelectorModal
        visible={selecting}
        selectedExercises={selectedExercises}
        onToggle={(exercise) => toggleExercise(exercise)}
        onClose={() => {
          addSelected();
          setSelecting(false);
        }}
      />
    </Modal>
  );
}
