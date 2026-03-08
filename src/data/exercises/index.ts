import type { Exercise } from "../../types/accounting";
import { week1InternExercises } from "./week1Intern";
import { week2JuniorExercises } from "./week2Junior";

// Тук ще добавяш следващите седмици:
// import { week3SeniorExercises } from "./week3Senior";
// import { week4ChiefExercises } from "./week4Chief";
// import { examExercises } from "./exams";

export const simulatorExercises: Exercise[] = [
  ...week1InternExercises,
  ...week2JuniorExercises,
  // ...week3SeniorExercises,
  // ...week4ChiefExercises,
  // ...examExercises,
];