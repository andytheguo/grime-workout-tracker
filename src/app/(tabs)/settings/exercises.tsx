import { styles } from "@/constants/styles";
import { createExercise } from "@/data/database";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Exercises() {
  const [exerciseName, setExerciseName] = useState("");

  const db = useSQLiteContext();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Exercise name"
        placeholderTextColor="white"
        onChangeText={setExerciseName}
        value={exerciseName}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

      <Pressable style={styles.button} onPress={async () => {
        await createExercise(db, exerciseName);
        setExerciseName("");
      }}>
        <Text style={styles.text}>Add Exercise</Text>
      </Pressable>
    </View>
   );
}
