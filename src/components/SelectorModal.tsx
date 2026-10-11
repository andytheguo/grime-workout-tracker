import { styles } from "@/constants/styles";
import { useExerciseContext } from "@/contexts/ExerciseContext";
import { Exercise } from "@/data/database"
import Checkbox from "expo-checkbox";
import { useHeaderHeight } from "expo-router/build/react-navigation";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface SelectorModalProps {
  visible: boolean,
  selectedExercises: Map<number, Exercise>,
  onToggle: (exercise: Exercise) => void,
  onClose: () => void
};

export function SelectorModal({
  visible,
  selectedExercises,
  onToggle,
  onClose
}: SelectorModalProps) {
  const { exercises } = useExerciseContext();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, marginBottom: 20 }}>Exercises:</Text>

          <ScrollView>
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
          </ScrollView>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.text}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
