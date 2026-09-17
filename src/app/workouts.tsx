import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Workouts() {
  return (
    <View style={styles.container}>
      <Link href="/">Home</Link>
      <Link href="/progress">Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
