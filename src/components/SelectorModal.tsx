import { styles } from "@/constants/styles";
import { useRoutineDraftContext } from "@/contexts/RoutineDraftContext"
import { Exercise } from "@/data/database"
import Checkbox from "expo-checkbox";
import { Modal, Pressable, Text, View } from "react-native";

interface SelectorModalProps {
  visible: boolean,
  exercises: Exercise[],
  selectedExercises: Map<number, Exercise>,
  onToggle: (exercise: Exercise) => void,
  onClose: () => void
};

export function SelectorModal({
  visible,
  exercises,
  selectedExercises,
  onToggle,
  onClose
}: SelectorModalProps) {

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
                onValueChange={() => onToggle(exercise)}
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
