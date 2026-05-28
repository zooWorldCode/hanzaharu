"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type LearningType = "meaning" | "vocab" | "idioms";

type ContextValue = {
  learningType: LearningType;
  setLearningType: (type: LearningType) => void;
};

const LearningTypeContext = createContext<ContextValue>({
  learningType: "meaning",
  setLearningType: () => {},
});

export function LearningTypeProvider({ children }: { children: ReactNode }) {
  const [learningType, setLearningType] = useState<LearningType>("meaning");
  return (
    <LearningTypeContext.Provider value={{ learningType, setLearningType }}>
      {children}
    </LearningTypeContext.Provider>
  );
}

export function useLearningType() {
  return useContext(LearningTypeContext);
}
