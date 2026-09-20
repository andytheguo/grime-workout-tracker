import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync("tracker");

await db.execAsync(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS routine_exercises (
  id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercise(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sets (
  id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
  routine_exercises_id INTEGER NOT NULL,
  FOREIGN KEY (routine_exercises_id) REFERENCES routine_exercises(id) ON DELETE CASCADE
);
`);
