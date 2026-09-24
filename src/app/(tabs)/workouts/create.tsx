import { styles } from "@/constants/styles";
import { createRoutine } from "@/data/database";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function CreateRoutine() {
  const router = useRouter();

  const [name, setName] = useState("");

  const db = useSQLiteContext();

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="white"
        onChangeText={(text) => setName(text)}
        value={name}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "black",
          color: "white"
        }}
      />

      <Pressable style={styles.button} onPress={() => router.navigate("/workouts/add")}>
        <Text style={styles.text}>Add Exercises</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => {
        async function saveRoutine() {
          const routineName = name.trim();

          if (routineName.trim() === "") return;

          await createRoutine(db, routineName);
        }
        saveRoutine();
        router.back();
      }}>
        <Text style={styles.text}>Save</Text>
      </Pressable>
    </View>
  );
}
