import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CreateRoutine() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text style={styles.text}>Add Exercise</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "rgb(26,26,26)"
  },
  text: {
    fontSize: 25,
    color: "white"
  }
});
