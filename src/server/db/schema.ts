// Kysely database schema type definitions

import { Generated, Insertable, Selectable, Updateable } from 'kysely';

/**
 * Users table - tracks individual users with optional phone number
 */
export interface UsersTable {
  id: Generated<string>;               // UUID, auto-generated
  name: string;                         // User's name
  phone_number: string | null;          // Optional phone number
  created_at: Generated<Date>;          // Auto-generated timestamp
  updated_at: Generated<Date>;          // Auto-updated timestamp
}

/**
 * Questions table - stores all trivia questions
 */
export interface QuestionsTable {
  id: string;                                                        // PK like "hist_001"
  category: 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics';
  question_text: string;                                             // The question
  options: string;                                                   // JSONB array of 4 strings
  correct_answer_index: number;                                      // 0-3
  explanation: string | null;                                        // Optional explanation
  difficulty: 'easy' | 'medium' | 'hard' | null;                     // Optional difficulty
  date_added: Generated<Date>;                                       // When question was added
  is_active: Generated<boolean>;                                     // Whether question is active
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

/**
 * Quiz attempts table - one row per user per day
 * Unique constraint on (user_id, quiz_date)
 */
export interface QuizAttemptsTable {
  id: Generated<string>;               // UUID, auto-generated
  user_id: string;                     // FK to users.id
  quiz_date: string;                   // YYYY-MM-DD format
  score: number;                       // 0-5
  completed_at: Date;                  // When quiz was completed
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

/**
 * User answers table - individual answers within a quiz attempt
 */
export interface UserAnswersTable {
  id: Generated<string>;               // UUID, auto-generated
  quiz_attempt_id: string;             // FK to quiz_attempts.id
  question_id: string;                 // FK to questions.id
  selected_answer_index: number;       // 0-3
  is_correct: boolean;                 // Whether answer was correct
  time_spent_ms: number | null;        // Optional time tracking
  created_at: Generated<Date>;
}

/**
 * Database interface - maps table names to their schemas
 */
export interface Database {
  users: UsersTable;
  questions: QuestionsTable;
  quiz_attempts: QuizAttemptsTable;
  user_answers: UserAnswersTable;
}

// Helper types for working with table rows

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type Question = Selectable<QuestionsTable>;
export type NewQuestion = Insertable<QuestionsTable>;
export type QuestionUpdate = Updateable<QuestionsTable>;

export type QuizAttempt = Selectable<QuizAttemptsTable>;
export type NewQuizAttempt = Insertable<QuizAttemptsTable>;
export type QuizAttemptUpdate = Updateable<QuizAttemptsTable>;

export type UserAnswer = Selectable<UserAnswersTable>;
export type NewUserAnswer = Insertable<UserAnswersTable>;
export type UserAnswerUpdate = Updateable<UserAnswersTable>;
