import type { Level } from "../../types/accounting";

type WeekConfig = {
  week: 1 | 2 | 3 | 4;
  level: Level;
  label: string;
  minExamScore: number; // 0.7 = 70%
  totalExercises: number;
  requiredWeekToUnlock?: 1 | 2 | 3;
  requiredExamWeek?: 1 | 2 | 3;
  nextWeek: 2 | 3 | 4 | null;
};

export const progressionConfig: Record<1 | 2 | 3 | 4, WeekConfig> = {
  1: {
    week: 1,
    level: "intern",
    label: "Стажант счетоводител",
    minExamScore: 0.7,
    totalExercises: 8,
    nextWeek: 2,
  },
  2: {
    week: 2,
    level: "junior",
    label: "Младши счетоводител",
    minExamScore: 0.7,
    totalExercises: 7,
    requiredWeekToUnlock: 1,
    requiredExamWeek: 1,
    nextWeek: 3,
  },
  3: {
    week: 3,
    level: "senior",
    label: "Старши счетоводител",
    minExamScore: 0.7,
    totalExercises: 0, // Ще добавяш после
    requiredWeekToUnlock: 2,
    requiredExamWeek: 2,
    nextWeek: 4,
  },
  4: {
    week: 4,
    level: "chief",
    label: "Главен счетоводител",
    minExamScore: 0.7,
    totalExercises: 0, // Ще добавяш после
    requiredWeekToUnlock: 3,
    requiredExamWeek: 3,
    nextWeek: null,
  },
};