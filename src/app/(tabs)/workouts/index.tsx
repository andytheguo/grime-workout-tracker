import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Workouts() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Pressable style={styles.button} onPress={() => router.navigate("/workouts/create")}>
          <Text style={styles.text}>New Routine</Text>
        </Pressable>
      </View>
      <View>
        <Text>Your Routines</Text>
      </View>
    </View>
  );
}
