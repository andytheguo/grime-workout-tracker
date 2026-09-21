import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => router.navigate("/settings/exercises")}>
        <Text style={styles.text}>Exercises</Text>
      </Pressable>
    </View>
  );
}
