import { Exercise } from "@/data/database";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

export type SetDraft = {
  weight: number,
  reps: number
};

type RoutineDraft = {
  // Map exercise ID to exercise
  selectedExercises: Map<number, Exercise>,
  setSelectedExercises: Dispatch<SetStateAction<Map<number, Exercise>>>
  // Map exercise ID to set
  exerciseSets: Map<number, SetDraft[]>,
  setExerciseSets: Dispatch<SetStateAction<Map<number, SetDraft[]>>>
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
  const [selectedExercises, setSelectedExercises] = useState<Map<number, Exercise>>(new Map());
  const [exerciseSets, setExerciseSets] = useState<Map<number, SetDraft[]>>(new Map())

  return (
    <RoutineDraftContext.Provider value={{
      selectedExercises,
      setSelectedExercises,
      exerciseSets,
      setExerciseSets
    }}>
      {children}
    </RoutineDraftContext.Provider>
  )
}
