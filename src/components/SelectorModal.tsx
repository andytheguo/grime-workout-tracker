import { styles } from "@/constants/styles";
import { useRoutineDraftContext } from "@/contexts/RoutineDraftContext"
import { Exercise } from "@/data/database"
import Checkbox from "expo-checkbox";
import { Modal, Pressable, Text, View } from "react-native";

interface SelectorModalProps {
  visible: boolean,
  exercises: Exercise[]
  onClose: () => void
};

export function SelectorModal({
  visible,
  exercises,
  onClose
}: SelectorModalProps) {
  const { selectedExercises, setSelectedExercises, setExerciseSets } = useRoutineDraftContext();

  function toggleExercise(exercise: Exercise) {
    setSelectedExercises((oldExercises) => {
      const exerciseMap = new Map(oldExercises);

      if (exerciseMap.has(exercise.id)) {
        exerciseMap.delete(exercise.id);

        setExerciseSets((oldSets) => {
          const setMap = new Map(oldSets);
          setMap.delete(exercise.id);
          return setMap;
        });
      }
      else {
        exerciseMap.set(exercise.id, exercise);

        setExerciseSets((oldSets) => {
          const setMap = new Map(oldSets);

          // Default sets
          setMap.set(exercise.id, [{
            weight: 0,
            reps: 0
          }]);

          return setMap
        });
      }

      return exerciseMap;
    });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {exercises.map((exercise) => {
          return (
            <View key={exercise.id}>
              <Checkbox
                value={selectedExercises.has(exercise.id)}
                onValueChange={() => toggleExercise(exercise)}
              />
              <Text style={{ fontSize: 25 }}>{exercise.name}</Text>
            </View>
          );
        })}

        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.text}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
