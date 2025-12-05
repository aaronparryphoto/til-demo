// localStorage utilities for quiz data persistence

import {
  QuizAttempt,
  UserStats,
  QuizState,
  STORAGE_KEYS,
  QuizCategory,
  CATEGORY_ORDER,
} from './types';

// Type for quiz attempts storage (keyed by date)
type QuizAttemptsStorage = {
  [date: string]: QuizAttempt;
};

/**
 * Safely parse JSON from localStorage
 */
function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get all quiz attempts from localStorage
 */
export function getQuizAttempts(): QuizAttemptsStorage {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
  return safeJSONParse<QuizAttemptsStorage>(data, {});
}

/**
 * Get quiz attempt for a specific date
 */
export function getQuizAttempt(date: string): QuizAttempt | null {
  const attempts = getQuizAttempts();
  return attempts[date] || null;
}

/**
 * Save a quiz attempt
 */
export function saveQuizAttempt(attempt: QuizAttempt): void {
  if (typeof window === 'undefined') return;
  const attempts = getQuizAttempts();
  attempts[attempt.date] = attempt;
  localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts));
}

/**
 * Get current quiz session state
 */
export function getCurrentSession(): QuizState | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  return safeJSONParse<QuizState | null>(data, null);
}

/**
 * Save current quiz session state
 */
export function saveCurrentSession(state: QuizState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(state));
}

/**
 * Clear current quiz session
 */
export function clearCurrentSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
}

/**
 * Get user statistics
 */
export function getUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return createEmptyStats();
  }
  const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  return safeJSONParse<UserStats>(data, createEmptyStats());
}

/**
 * Save user statistics
 */
export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

/**
 * Create empty user stats object
 */
function createEmptyStats(): UserStats {
  const categoryStats: UserStats['categoryStats'] = {} as UserStats['categoryStats'];

  CATEGORY_ORDER.forEach((category: QuizCategory) => {
    categoryStats[category] = {
      total: 0,
      correct: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  });

  return {
    totalQuizzesCompleted: 0,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    currentStreak: 0,
    longestStreak: 0,
    categoryStats,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get the last completed quiz date
 */
export function getLastCompletedDate(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.LAST_COMPLETED_DATE);
}

/**
 * Set the last completed quiz date
 */
export function setLastCompletedDate(date: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LAST_COMPLETED_DATE, date);
}

/**
 * Clear all quiz data (for testing/reset)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Export all quiz data as JSON string
 */
export function exportData(): string {
  if (typeof window === 'undefined') return '{}';
  const data = {
    attempts: getQuizAttempts(),
    stats: getUserStats(),
    lastCompleted: getLastCompletedDate(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Import quiz data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.attempts) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(data.attempts));
    }
    if (data.stats) {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(data.stats));
    }
    if (data.lastCompleted) {
      localStorage.setItem(STORAGE_KEYS.LAST_COMPLETED_DATE, data.lastCompleted);
    }
    return true;
  } catch {
    return false;
  }
}
