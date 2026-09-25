import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type RoutineDraft = {
  selectedExercises: number[],
  setSelectedExercises: Dispatch<SetStateAction<number[]>>
}

export const RoutineDraftContext = createContext<RoutineDraft | undefined>(undefined);

export function useRoutineDraftContext() {
  const routineDraft = useContext(RoutineDraftContext);

  if (routineDraft === undefined) {
    throw new Error("useRoutineDraftContext must be used with a RoutineDraftContext");
  }

  return routineDraft;
}

export function RoutineDraftProvider({ children } : { children: ReactNode }) {
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);

  return (
    <RoutineDraftContext.Provider value={{ selectedExercises, setSelectedExercises }}>
      {children}
    </RoutineDraftContext.Provider>
  )
}
