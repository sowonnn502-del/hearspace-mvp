"use client";

import { createContext, useContext } from "react";

export type ResultProgressStage =
  | "IMAGE_READY"
  | "TITLE_READY"
  | "MEMORY_READY"
  | "MUSIC_READY"
  | "SHARE_READY";

const progressOrder: ResultProgressStage[] = [
  "IMAGE_READY",
  "TITLE_READY",
  "MEMORY_READY",
  "MUSIC_READY",
  "SHARE_READY",
];

type ResultProgressContextValue = {
  stage: ResultProgressStage;
  isAtLeast: (stage: ResultProgressStage) => boolean;
};

const ResultProgressContext = createContext<ResultProgressContextValue>({
  stage: "IMAGE_READY",
  isAtLeast: (stage) => stage === "IMAGE_READY",
});

export function ResultProgressProvider({
  stage,
  children,
}: {
  stage: ResultProgressStage;
  children: React.ReactNode;
}) {
  return (
    <ResultProgressContext.Provider
      value={{
        stage,
        isAtLeast: (targetStage) =>
          progressOrder.indexOf(stage) >= progressOrder.indexOf(targetStage),
      }}
    >
      {children}
    </ResultProgressContext.Provider>
  );
}

export function useResultProgress() {
  return useContext(ResultProgressContext);
}
