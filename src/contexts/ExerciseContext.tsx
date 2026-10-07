import { Exercise, getExercises } from "@/data/database";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ExerciseContextType = {
  exercises: Exercise[]
};

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function useExerciseContext() {
  const exerciseContext = useContext(ExerciseContext);

  if (exerciseContext === undefined) {
    throw new Error("useExerciseContext must be used with an ExerciseContextContext");
  }

  return exerciseContext;
}

export function ExerciseContextProvider({ children } : { children: ReactNode }) {
  const db = useSQLiteContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await getExercises(db);
      setExercises(result);
    }

    setup()
  }, [db]);

  return (
    <ExerciseContext.Provider value={{ exercises }}>
      {children}
    </ExerciseContext.Provider>
  )
}
