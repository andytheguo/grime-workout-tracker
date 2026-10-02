import { styles } from "@/constants/styles";
import { ExerciseSet } from "@/data/database";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface SetLoggerProps {
  set: ExerciseSet,
  index: number,
  onSave: (weight: number, reps: number) => void,
  onDelete: () => void
};

export function SetLogger({ set, index, onSave, onDelete }: SetLoggerProps) {
  const [weight, setWeight] = useState<string>(String(set.weight));
  const [reps, setReps] = useState<string>(String(set.reps));

  return (
    <View>
      <Text>Set: {index + 1}</Text>

      <TextInput
        placeholderTextColor="white"
        onChangeText={setWeight}
        value={weight}
        onEndEditing={() => onSave(Number(weight), Number(reps))}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

      <TextInput
        placeholderTextColor="white"
        onChangeText={setReps}
        value={String(reps)}
        onEndEditing={() => onSave(Number(weight), Number(reps))}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

      <Pressable style={styles.button} onPress={onDelete}>
        <Text style={styles.text}>Delete</Text>
      </Pressable>
    </View>
  );
}
