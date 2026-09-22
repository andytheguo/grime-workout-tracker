import * as SQLite from "expo-sqlite";

export async function initDatabase(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULl,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS routine_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    routine_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    weight INTEGER,
    reps INTEGER,
    routine_exercises_id INTEGER NOT NULL,
    FOREIGN KEY (routine_exercises_id) REFERENCES routine_exercises(id) ON DELETE CASCADE
  );
`);
}

export async function createExercise(db: SQLite.SQLiteDatabase, name: string) {
  const result = await db.runAsync("INSERT INTO exercises (name) VALUES (?)", name);

  // TODO: TEST
  console.log("Added exercise: " + name);

  return result.lastInsertRowId;
}

export async function getExercises(db: SQLite.SQLiteDatabase) {
  const result = await db.getAllAsync <{ id: number, name: string }>("SELECT id, name FROM exercises ORDER BY name");

  return result;
}

export async function updateExercse(db: SQLite.SQLiteDatabase, options: { id: number, name: string }) {
  await db.runAsync("UPDATE exercises SET name = ?, where id = ?", options);
}

export async function deleteExercise(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM exercises where id = ?", id);
}

export async function getExercise(db: SQLite.SQLiteDatabase, id: number) {
  return await db.getFirstAsync<{ id: number, name: string }>("SELECT id, name FROM exercises WHERE id = ?", id);
}
