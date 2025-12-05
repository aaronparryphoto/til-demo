// Type Definitions for TIL Trivia Game

export type QuizCategory = 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics';

export interface Question {
  id: string;
  category: QuizCategory;
  questionText: string;
  options: string[]; // exactly 4 options
  correctAnswerIndex: number; // 0-3
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  dateAdded?: string; // ISO date string
}

export interface DailyQuiz {
  date: string; // ISO date string (YYYY-MM-DD)
  questions: Question[]; // exactly 5 questions in category order
}

export interface UserAnswer {
  questionId: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  timeSpent?: number; // milliseconds
}

export interface QuizAttempt {
  date: string; // ISO date string (YYYY-MM-DD)
  answers: UserAnswer[];
  score: number; // 0-5
  completedAt: string; // ISO timestamp
  categoryBreakdown: {
    [key in QuizCategory]: boolean; // true if correct
  };
}

export interface CategoryStats {
  total: number;
  correct: number;
  currentStreak: number;
  longestStreak: number;
}

export interface UserStats {
  totalQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  currentStreak: number; // consecutive days with at least 1 correct
  longestStreak: number;
  categoryStats: {
    [key in QuizCategory]: CategoryStats;
  };
  lastUpdated: string; // ISO timestamp
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startedAt: string; // ISO timestamp
  isComplete: boolean;
}

// Answer option state for UI
export type AnswerState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'revealed';

// localStorage keys
export const STORAGE_KEYS = {
  QUIZ_ATTEMPTS: 'til_quiz_attempts',
  USER_STATS: 'til_user_stats',
  CURRENT_SESSION: 'til_current_session',
  LAST_COMPLETED_DATE: 'til_last_completed_date',
} as const;

// Category order for daily quiz
export const CATEGORY_ORDER: QuizCategory[] = [
  'History',
  'Science',
  'Geography',
  'Pop Culture',
  'Politics',
];

// Number of questions per daily quiz
export const QUESTIONS_PER_DAY = 5;
