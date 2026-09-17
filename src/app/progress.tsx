import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Progress() {
  return (
    <View style={styles.container}>
      <Link href="/"></Link>
      <Link href="/workouts"></Link>
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
