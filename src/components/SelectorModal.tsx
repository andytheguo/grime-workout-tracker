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
  const { selectedExercises, setSelectedExercises } = useRoutineDraftContext();

  function toggleExercise(exercise: Exercise) {
    setSelectedExercises((oldExercises) => {
      const map = new Map(oldExercises);

      if (map.has(exercise.id)) {
        map.delete(exercise.id);
      }
      else {
        map.set(exercise.id, exercise);
      }

      return map;
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
