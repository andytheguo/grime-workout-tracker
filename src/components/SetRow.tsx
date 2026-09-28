import { ExerciseSet, updateSet } from "@/data/database";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export function SetRow({ set, index } : { set: ExerciseSet, index: number}) {
  const [weight, setWeight] = useState<string>(String(set.weight));
  const [reps, setReps] = useState<string>(String(set.reps));

  const db = useSQLiteContext();

  return (
    <View>
      <Text>Set: {index + 1}</Text>

      <TextInput
        placeholderTextColor="white"
        onChangeText={setWeight}
        value={weight}
        onEndEditing={async () => await updateSet(db, { id: set.id, weight: Number(weight), reps: Number(reps) })}
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
        onEndEditing={async () => await updateSet(db, { id: set.id, weight: Number(weight), reps: Number(reps) })}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

    </View>
  );
}
