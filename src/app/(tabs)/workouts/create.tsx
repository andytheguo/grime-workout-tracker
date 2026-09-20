import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function CreateRoutine() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => router.navigate("/workouts/add")}>
        <Text style={styles.text}>Add Exercises</Text>
      </Pressable>
    </View>
  );
}
