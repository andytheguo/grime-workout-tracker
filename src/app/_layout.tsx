import { initDatabase } from "@/data/database";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="tracker" onInit={initDatabase} options={{ useNewConnection: false }}>
      <Stack screenOptions={{ headerShown: false }}/>
    </SQLiteProvider>
  );
}
