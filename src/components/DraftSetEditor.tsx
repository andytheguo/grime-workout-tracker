
import { styles } from "@/constants/styles";
import { SetDraft } from "@/contexts/RoutineDraftContext";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface DraftSetEditorProps {
  set: SetDraft,
  index: number,
  onSave: (weight: number, reps: number) => void,
  onDelete: () => void
};

export function DraftSetEditor({ set, index, onSave, onDelete }: DraftSetEditorProps) {
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
