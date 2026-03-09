// Запазва прогреса в localStorage
export const PROGRESS_KEY = 'accountify_progress';

export interface UserProgress {
  completedTasks: string[]; // масив от ID-та на решени задачи (напр. ["EX001", "EX002"])
  currentLevel: number; // 1=Стажант, 2=Младши, 3=Старши, 4=Главен
  lastUpdated: string;
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return { completedTasks: [], currentLevel: 1, lastUpdated: new Date().toISOString() };
  }
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return { completedTasks: [], currentLevel: 1, lastUpdated: new Date().toISOString() };
}

export function saveProgress(progress: UserProgress) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

export function markTaskComplete(taskId: string) {
  const progress = getProgress();
  if (!progress.completedTasks.includes(taskId)) {
    progress.completedTasks.push(taskId);
    progress.lastUpdated = new Date().toISOString();
    saveProgress(progress);
  }
}

// Проверява дали може да се отключи следващо ниво
export function canUnlockLevel(level: number): boolean {
  const progress = getProgress();
  const requiredTasks: Record<number, string[]> = {
    2: ['EX001','EX002','EX003','EX004','EX005','EX006','EX007','EX008'], // 8 задачи Week 1
    3: ['EX009','EX010','EX011','EX012','EX013','EX014','EX015'], // 7 задачи Week 2
    4: [] // Week 3 (когато ги добавиш)
  };
  
  if (level === 1) return true; // Ниво 1 винаги отворено
  const required = requiredTasks[level] || [];
  return required.every(taskId => progress.completedTasks.includes(taskId));
}

export function getCompletedCountForLevel(level: number): number {
  const progress = getProgress();
  const levelTasks: Record<number, string[]> = {
    1: ['EX001','EX002','EX003','EX004','EX005','EX006','EX007','EX008'],
    2: ['EX009','EX010','EX011','EX012','EX013','EX014','EX015']
  };
  const tasks = levelTasks[level] || [];
  return tasks.filter(id => progress.completedTasks.includes(id)).length;
}