import * as SQLite from "expo-sqlite";

export type Routine = {
  id: number,
  name: string,
}

export type Exercise = {
  id: number,
  name: string,
};

export type RoutineExercise = {
  id: number,
  routineId: number,
  exerciseId: number,
  name: string
};

export type ExerciseSet = {
  id: number,
  weight: number,
  reps: number,
  routineExerciseId: number
};

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
    weight INTEGER NOT NULL DEFAULT 0,
    reps INTEGER NOT NULL DEFAULT 0,
    routine_exercise_id INTEGER NOT NULL,
    FOREIGN KEY (routine_exercise_id) REFERENCES routine_exercises(id) ON DELETE CASCADE
  );
`);
}

export async function createExercise(db: SQLite.SQLiteDatabase, name: string) {
  const result = await db.runAsync("INSERT INTO exercises (name) VALUES (?)", name);

  // TEST
  console.log("Added exercise: " + name);

  return result.lastInsertRowId;
}

export async function getExercises(db: SQLite.SQLiteDatabase) {
  const result = await db.getAllAsync<Exercise>("SELECT id, name FROM exercises ORDER BY name");

  return result;
}

export async function updateExercise(db: SQLite.SQLiteDatabase, options: { id: number, name: string }) {
  const result = await db.runAsync("UPDATE exercises SET name = ? WHERE id = ?", options.name, options.id);

  // TEST
  console.log("No. exercises changed: " + result.changes);
}

export async function deleteExercise(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM exercises WHERE id = ?", id);
}

export async function getExercise(db: SQLite.SQLiteDatabase, id: number) {
  return await db.getFirstAsync<Exercise>("SELECT id, name FROM exercises WHERE id = ?", id);
}

export async function createRoutine(db: SQLite.SQLiteDatabase, name: string) {
  const result = await db.runAsync("INSERT INTO routines (name) VALUES (?)", name);

  // TEST
  console.log("Added routine: " + name);

  return result.lastInsertRowId;
}

export async function getRoutines(db: SQLite.SQLiteDatabase) {
  const result = await db.getAllAsync<Routine>("SELECT id, name FROM routines ORDER BY name");

  return result;
}

export async function updateRoutine(db: SQLite.SQLiteDatabase, options: { id: number, name: string }) {
  const result = await db.runAsync("UPDATE routines SET name = ? WHERE id = ?", options.name, options.id);

  // TEST
  console.log("No. routines changed: " + result.changes);
}

export async function deleteRoutine(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM routines WHERE id = ?", id);
}

export async function getRoutine(db: SQLite.SQLiteDatabase, id: number) {
  return await db.getFirstAsync<Routine>("SELECT id, name FROM routines WHERE id = ?", id);
}

export async function createRoutineExercise(db: SQLite.SQLiteDatabase, routineId: number, exerciseId: number) {
  const result = await db.runAsync("INSERT INTO routine_exercises (routine_id, exercise_id) VALUES (?, ?)", routineId, exerciseId);

  return result.lastInsertRowId;
}

export async function getRoutineExercises(db: SQLite.SQLiteDatabase, routineId: number) {
  const result = await db.getAllAsync<RoutineExercise>(`
    SELECT routine_exercises.id AS id, routine_exercises.routine_id AS routineId, routine_exercises.exercise_id AS routineId, exercises.name AS name
    FROM routine_exercises
    JOIN exercises ON routine_exercises.exercise_id = exercises.id
    WHERE routine_exercises.routine_id = ?
    ORDER BY exercises.name
    `,
    routineId
  );

  return result;
}

export async function updateRoutineExercise(db: SQLite.SQLiteDatabase, options: { id: number, exerciseId: number }) {
  await db.runAsync("UPDATE routine_exercises SET exercise_id = ? WHERE id = ?", options.exerciseId, options.id);
}

export async function deleteRoutineExercise(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM routine_exercises WHERE id = ?", id);
}

export async function createSet(db: SQLite.SQLiteDatabase, routineExerciseId: number) {
  const result = await db.runAsync("INSERT INTO sets (routine_exercise_id) VALUES (?)", routineExerciseId);

  return result.lastInsertRowId;
}

export async function getSets(db: SQLite.SQLiteDatabase, routineExerciseId: number) {
  const result = await db.getAllAsync<ExerciseSet>("SELECT id, weight, reps, routine_exercise_id AS routineExerciseId FROM sets WHERE routine_exercise_id = ? ORDER BY id", routineExerciseId);

  return result;
}

export async function updateSet(db: SQLite.SQLiteDatabase, options: { id: number, weight: number, reps: number }) {
  await db.runAsync("UPDATE sets SET weight = ?, reps = ? WHERE id = ?", options.weight, options.reps, options.id);
}

export async function deleteSet(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM sets WHERE id = ?", id);
}

export async function getSet(db: SQLite.SQLiteDatabase, id: number) {
  return await db.getFirstAsync<ExerciseSet>("SELECT id, weight, reps, routine_exercise_id AS routineExerciseId FROM sets WHERE id = ?", id);
}
