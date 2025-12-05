// Database queries for user statistics

import { db } from '@/server/connections/db';
import { sql } from 'kysely';

type QuizCategory = 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics';

interface CategoryStats {
  totalCorrect: number;
  totalAnswered: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Get all quiz attempts for a user, ordered by date descending
 */
export async function getUserAttempts(userId: string) {
  const attempts = await db
    .selectFrom('quiz_attempts')
    .selectAll()
    .where('user_id', '=', userId)
    .orderBy('quiz_date', 'desc')
    .execute();

  return attempts;
}

/**
 * Calculate current streak for a user
 * Streak is broken if user misses a day or scores 0
 */
export async function calculateCurrentStreak(userId: string): Promise<number> {
  const attempts = await getUserAttempts(userId);

  if (attempts.length === 0) {
    return 0;
  }

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);

  for (const attempt of attempts) {
    const attemptDate = new Date(attempt.quiz_date + 'T00:00:00');
    const diffDays = Math.floor(
      (checkDate.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If this attempt is on the checkDate and score > 0, increment streak
    if (diffDays === 0 && attempt.score > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    // If we've moved past the checkDate, streak is broken
    else if (diffDays > 0) {
      break;
    }
  }

  return streak;
}

/**
 * Calculate longest streak for a user
 */
export async function calculateLongestStreak(userId: string): Promise<number> {
  const attempts = await getUserAttempts(userId);

  if (attempts.length === 0) {
    return 0;
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  // Process attempts in chronological order (oldest first)
  const reversedAttempts = [...attempts].reverse();

  for (const attempt of reversedAttempts) {
    const attemptDate = new Date(attempt.quiz_date + 'T00:00:00');

    if (attempt.score === 0) {
      // Score of 0 breaks the streak
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0;
      previousDate = attemptDate;
      continue;
    }

    if (previousDate === null) {
      // First attempt with score > 0
      currentStreak = 1;
    } else {
      const diffDays = Math.floor(
        (attemptDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        // Consecutive day
        currentStreak++;
      } else {
        // Gap in days
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    previousDate = attemptDate;
  }

  longestStreak = Math.max(longestStreak, currentStreak);
  return longestStreak;
}

/**
 * Get category-specific statistics for a user
 */
export async function getCategoryStats(
  userId: string,
  category: QuizCategory
): Promise<CategoryStats> {
  // Get all answers for this category
  const result = await db
    .selectFrom('user_answers')
    .innerJoin('quiz_attempts', 'quiz_attempts.id', 'user_answers.quiz_attempt_id')
    .innerJoin('questions', 'questions.id', 'user_answers.question_id')
    .select([
      sql<number>`COUNT(*)`.as('total_answered'),
      sql<number>`SUM(CASE WHEN user_answers.is_correct THEN 1 ELSE 0 END)`.as('total_correct'),
    ])
    .where('quiz_attempts.user_id', '=', userId)
    .where('questions.category', '=', category)
    .executeTakeFirst();

  const totalAnswered = Number(result?.total_answered || 0);
  const totalCorrect = Number(result?.total_correct || 0);

  // Calculate current and longest streaks for this category
  const { currentStreak, longestStreak } = await calculateCategoryStreaks(userId, category);

  return {
    totalCorrect,
    totalAnswered,
    currentStreak,
    longestStreak,
  };
}

/**
 * Calculate current and longest streaks for a specific category
 */
async function calculateCategoryStreaks(
  userId: string,
  category: QuizCategory
): Promise<{ currentStreak: number; longestStreak: number }> {
  // Get all attempts with this category's answer
  const attempts = await db
    .selectFrom('quiz_attempts')
    .innerJoin('user_answers', 'user_answers.quiz_attempt_id', 'quiz_attempts.id')
    .innerJoin('questions', 'questions.id', 'user_answers.question_id')
    .select(['quiz_attempts.quiz_date', 'user_answers.is_correct'])
    .where('quiz_attempts.user_id', '=', userId)
    .where('questions.category', '=', category)
    .orderBy('quiz_attempts.quiz_date', 'desc')
    .execute();

  if (attempts.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let checkDate = new Date(today);

  for (const attempt of attempts) {
    const attemptDate = new Date(attempt.quiz_date + 'T00:00:00');
    const diffDays = Math.floor(
      (checkDate.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 && attempt.is_correct) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (diffDays > 0) {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let previousDate: Date | null = null;

  const reversedAttempts = [...attempts].reverse();

  for (const attempt of reversedAttempts) {
    const attemptDate = new Date(attempt.quiz_date + 'T00:00:00');

    if (!attempt.is_correct) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
      previousDate = attemptDate;
      continue;
    }

    if (previousDate === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.floor(
        (attemptDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    previousDate = attemptDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

/**
 * Get total statistics for a user
 */
export async function getTotalStats(userId: string) {
  const result = await db
    .selectFrom('quiz_attempts')
    .select([
      sql<number>`COUNT(*)`.as('total_quizzes'),
      sql<number>`SUM(score)`.as('total_correct'),
      sql<number>`AVG(score)`.as('average_score'),
    ])
    .where('user_id', '=', userId)
    .executeTakeFirst();

  return {
    totalQuizzes: Number(result?.total_quizzes || 0),
    totalCorrect: Number(result?.total_correct || 0),
    averageScore: Number(result?.average_score || 0),
  };
}
