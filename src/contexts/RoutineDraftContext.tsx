import { Exercise } from "@/data/database";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type RoutineDraft = {
  selectedExercises: Map<number, Exercise>,
  setSelectedExercises: Dispatch<SetStateAction<Map<number, Exercise>>>
};

export const RoutineDraftContext = createContext<RoutineDraft | undefined>(undefined);

export function useRoutineDraftContext() {
  const routineDraft = useContext(RoutineDraftContext);

  if (routineDraft === undefined) {
    throw new Error("useRoutineDraftContext must be used with a RoutineDraftContext");
  }

  return routineDraft;
}

export function RoutineDraftProvider({ children } : { children: ReactNode }) {
  const [selectedExercises, setSelectedExercises] = useState<Map<number, Exercise>>(new Map<number, Exercise>());

  return (
    <RoutineDraftContext.Provider value={{ selectedExercises, setSelectedExercises }}>
      {children}
    </RoutineDraftContext.Provider>
  )
}

export function toggleExercise(selected: Map<number, Exercise>, exercise: Exercise) {
  const map = new Map(selected);
  selected.has(exercise.id) ? map.delete(exercise.id) : map.set(exercise.id, exercise);
  return map;
}
