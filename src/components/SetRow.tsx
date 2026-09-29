import { ExerciseSet } from "@/data/database";
import { Text, View } from "react-native";

export function SetRow({ set, index } : { set: ExerciseSet, index: number}) {
  return (
    <View>
      <Text style={{ fontSize: 25 }}>Set: {index + 1}</Text>
      <Text style={{ fontSize: 20 }}>Weight: {set.weight}kg</Text>
      <Text style={{ fontSize: 20 }}>Reps: {set.reps}</Text>
    </View>
  );
}
