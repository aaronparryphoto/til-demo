// Server actions for quiz operations
'use server';

import { db } from '@/server/connections/db';
import { ensureUser } from './user-actions';
import { getActiveQuestions, getQuestionsByCategory } from '@/server/db/queries/questions';
import { getTodayDate } from '@/lib/date-utils';

type QuizCategory = 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics';
const CATEGORY_ORDER: QuizCategory[] = [
  'History',
  'Science',
  'Geography',
  'Pop Culture',
  'Politics',
];

// Question interface matching the client-side type
export interface QuestionData {
  id: string;
  category: QuizCategory;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Deterministic random selection based on date seed
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function dateSeed(dateString: string): number {
  const parts = dateString.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  return year * 10000 + month * 100 + day;
}

function selectByDate<T>(items: T[], date: string, index: number = 0): T {
  const seed = dateSeed(date) + index;
  const randomIndex = Math.floor(seededRandom(seed) * items.length);
  return items[randomIndex];
}

/**
 * Get today's 5 questions (one from each category)
 * Uses deterministic selection based on date
 */
export async function getTodaysQuestions(): Promise<QuestionData[]> {
  const dateString = getTodayDate();
  const selectedQuestions: QuestionData[] = [];

  // For each category in order, select one question deterministically
  for (let categoryIndex = 0; categoryIndex < CATEGORY_ORDER.length; categoryIndex++) {
    const category = CATEGORY_ORDER[categoryIndex];
    const categoryQuestions = await getQuestionsByCategory(category);

    if (categoryQuestions.length === 0) {
      throw new Error(`No questions found for category: ${category}`);
    }

    // Select question deterministically based on date
    const dbQuestion = selectByDate(categoryQuestions, dateString, categoryIndex);

    // Transform database format to client format
    // Handle both cases: options might be already parsed (array) or still stringified
    const options = typeof dbQuestion.options === 'string'
      ? JSON.parse(dbQuestion.options)
      : dbQuestion.options;

    selectedQuestions.push({
      id: dbQuestion.id,
      category: dbQuestion.category,
      questionText: dbQuestion.question_text,
      options,
      correctAnswerIndex: dbQuestion.correct_answer_index,
      explanation: dbQuestion.explanation || undefined,
      difficulty: dbQuestion.difficulty || undefined,
    });
  }

  return selectedQuestions;
}

/**
 * Check if the current user has completed today's quiz
 */
export async function hasCompletedToday(): Promise<boolean> {
  const userId = await ensureUser();
  const today = getTodayDate();

  const attempt = await db
    .selectFrom('quiz_attempts')
    .select('id')
    .where('user_id', '=', userId)
    .where('quiz_date', '=', today)
    .executeTakeFirst();

  return !!attempt;
}

/**
 * Get a quiz attempt for a specific date
 */
export async function getQuizAttempt(date: string) {
  const userId = await ensureUser();

  const attempt = await db
    .selectFrom('quiz_attempts')
    .selectAll()
    .where('user_id', '=', userId)
    .where('quiz_date', '=', date)
    .executeTakeFirst();

  if (!attempt) {
    return null;
  }

  // Get the user's answers for this attempt
  const answers = await db
    .selectFrom('user_answers')
    .selectAll()
    .where('quiz_attempt_id', '=', attempt.id)
    .execute();

  // Build category breakdown
  const categoryBreakdown: Record<QuizCategory, boolean> = {
    History: false,
    Science: false,
    Geography: false,
    'Pop Culture': false,
    Politics: false,
  };

  // Get question details to determine categories
  const questionIds = answers.map((a) => a.question_id);
  const questions = await db
    .selectFrom('questions')
    .select(['id', 'category'])
    .where('id', 'in', questionIds)
    .execute();

  const questionMap = new Map(questions.map((q) => [q.id, q.category]));

  answers.forEach((answer) => {
    const category = questionMap.get(answer.question_id);
    if (category) {
      categoryBreakdown[category] = answer.is_correct;
    }
  });

  return {
    date: attempt.quiz_date,
    answers: answers.map((a) => ({
      questionId: a.question_id,
      selectedAnswerIndex: a.selected_answer_index,
      isCorrect: a.is_correct,
    })),
    score: attempt.score,
    completedAt: attempt.completed_at.toISOString(),
    categoryBreakdown,
  };
}

/**
 * Submit a completed quiz attempt
 */
export async function submitQuizAttempt(data: {
  date: string;
  answers: Array<{
    questionId: string;
    selectedAnswerIndex: number;
    isCorrect: boolean;
  }>;
  score: number;
}) {
  const userId = await ensureUser();

  // Create quiz attempt
  const attempt = await db
    .insertInto('quiz_attempts')
    .values({
      user_id: userId,
      quiz_date: data.date,
      score: data.score,
      completed_at: new Date(),
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  // Insert user answers
  await db
    .insertInto('user_answers')
    .values(
      data.answers.map((answer) => ({
        quiz_attempt_id: attempt.id,
        question_id: answer.questionId,
        selected_answer_index: answer.selectedAnswerIndex,
        is_correct: answer.isCorrect,
      }))
    )
    .execute();

  return { attemptId: attempt.id };
}
