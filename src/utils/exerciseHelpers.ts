import type { Exercise, Level } from "../types/accounting";

export function getExercisesByWeek(
  exercises: Exercise[],
  week: 1 | 2 | 3 | 4
): Exercise[] {
  return exercises
    .filter((ex) => ex.week === week && ex.mode === "story")
    .sort((a, b) => a.order - b.order);
}

export function getExamExercisesByWeek(
  exercises: Exercise[],
  week: 1 | 2 | 3 | 4
): Exercise[] {
  return exercises
    .filter((ex) => ex.week === week && ex.mode === "exam")
    .sort((a, b) => a.order - b.order);
}

export function getExerciseById(exercises: Exercise[], id: string): Exercise | undefined {
  return exercises.find((ex) => ex.id === id);
}

export function getTotalExercisesForWeek(exercises: Exercise[], week: 1 | 2 | 3 | 4): number {
  return exercises.filter((ex) => ex.week === week && ex.mode === "story").length;
}