// Quiz game logic and scoring

import {
  Question,
  UserAnswer,
  QuizAttempt,
  UserStats,
  QuizCategory,
  CATEGORY_ORDER,
} from './types';
import { areConsecutiveDates, getYesterdayDate } from './date-utils';
import { getQuizAttempts, getLastCompletedDate } from './quiz-storage';

/**
 * Check if an answer is correct
 */
export function checkAnswer(question: Question, selectedIndex: number): boolean {
  return question.correctAnswerIndex === selectedIndex;
}

/**
 * Calculate score from answers
 */
export function calculateScore(answers: UserAnswer[]): number {
  return answers.filter(answer => answer.isCorrect).length;
}

/**
 * Create a category breakdown from answers
 */
export function createCategoryBreakdown(
  answers: UserAnswer[],
  questions: Question[]
): QuizAttempt['categoryBreakdown'] {
  const breakdown: QuizAttempt['categoryBreakdown'] = {} as QuizAttempt['categoryBreakdown'];

  questions.forEach((question, index) => {
    const answer = answers[index];
    breakdown[question.category] = answer ? answer.isCorrect : false;
  });

  return breakdown;
}

/**
 * Create a quiz attempt object
 */
export function createQuizAttempt(
  date: string,
  answers: UserAnswer[],
  questions: Question[]
): QuizAttempt {
  return {
    date,
    answers,
    score: calculateScore(answers),
    completedAt: new Date().toISOString(),
    categoryBreakdown: createCategoryBreakdown(answers, questions),
  };
}

/**
 * Calculate current streak from quiz attempts
 * Returns number of consecutive days with at least 1 correct answer
 */
export function calculateCurrentStreak(attempts: { [date: string]: QuizAttempt }): number {
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let checkDate = today;

  while (true) {
    const attempt = attempts[checkDate];
    if (!attempt || attempt.score === 0) {
      break;
    }
    streak++;

    // Move to previous day
    const prevDate = new Date(checkDate + 'T00:00:00');
    prevDate.setDate(prevDate.getDate() - 1);
    checkDate = prevDate.toISOString().split('T')[0];
  }

  return streak;
}

/**
 * Calculate category streak from quiz attempts
 * Returns number of consecutive correct answers for a specific category
 */
export function calculateCategoryStreak(
  attempts: { [date: string]: QuizAttempt },
  category: QuizCategory
): number {
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let checkDate = today;

  while (true) {
    const attempt = attempts[checkDate];
    if (!attempt || !attempt.categoryBreakdown[category]) {
      break;
    }
    streak++;

    // Move to previous day
    const prevDate = new Date(checkDate + 'T00:00:00');
    prevDate.setDate(prevDate.getDate() - 1);
    checkDate = prevDate.toISOString().split('T')[0];
  }

  return streak;
}

/**
 * Update user stats based on a new quiz attempt
 */
export function updateStats(
  currentStats: UserStats,
  newAttempt: QuizAttempt
): UserStats {
  const allAttempts = getQuizAttempts();
  allAttempts[newAttempt.date] = newAttempt;

  // Calculate total stats
  const totalQuizzesCompleted = Object.keys(allAttempts).length;
  const totalQuestionsAnswered = totalQuizzesCompleted * 5;
  let totalCorrect = 0;

  // Calculate category stats
  const categoryStats = { ...currentStats.categoryStats };

  CATEGORY_ORDER.forEach(category => {
    let categoryTotal = 0;
    let categoryCorrect = 0;

    Object.values(allAttempts).forEach(attempt => {
      categoryTotal++;
      if (attempt.categoryBreakdown[category]) {
        categoryCorrect++;
        totalCorrect++;
      }
    });

    const categoryStreak = calculateCategoryStreak(allAttempts, category);

    categoryStats[category] = {
      total: categoryTotal,
      correct: categoryCorrect,
      currentStreak: categoryStreak,
      longestStreak: Math.max(
        categoryStats[category]?.longestStreak || 0,
        categoryStreak
      ),
    };
  });

  // Calculate overall streak (consecutive days with at least 1 correct)
  const currentStreak = calculateCurrentStreak(allAttempts);

  return {
    totalQuizzesCompleted,
    totalQuestionsAnswered,
    totalCorrect,
    currentStreak,
    longestStreak: Math.max(currentStats.longestStreak, currentStreak),
    categoryStats,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate shareable result text (Wordle-style)
 */
export function generateShareText(attempt: QuizAttempt): string {
  const { score, categoryBreakdown } = attempt;
  const date = new Date(attempt.date + 'T00:00:00');
  const dateString = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Create emoji grid
  const grid = CATEGORY_ORDER.map(category => {
    return categoryBreakdown[category] ? '🟩' : '⬜';
  }).join('');

  return `TIL Trivia ${dateString}\n${score}/5\n\n${grid}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
