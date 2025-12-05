// Server actions for user statistics
'use server';

import { ensureUser } from './user-actions';
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getCategoryStats,
  getTotalStats,
} from '@/server/db/queries/user-stats';

type QuizCategory = 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics';

const CATEGORY_ORDER: QuizCategory[] = [
  'History',
  'Science',
  'Geography',
  'Pop Culture',
  'Politics',
];

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalQuizzes: number;
  totalCorrectAnswers: number;
  categoryStats: {
    [key in QuizCategory]: {
      totalCorrect: number;
      totalAnswered: number;
      currentStreak: number;
      longestStreak: number;
    };
  };
}

/**
 * Get complete statistics for the current user
 */
export async function getUserStats(): Promise<UserStats> {
  const userId = await ensureUser();

  // Get overall stats
  const [currentStreak, longestStreak, totalStats] = await Promise.all([
    calculateCurrentStreak(userId),
    calculateLongestStreak(userId),
    getTotalStats(userId),
  ]);

  // Get stats for each category
  const categoryStatsPromises = CATEGORY_ORDER.map((category) =>
    getCategoryStats(userId, category)
  );
  const categoryStatsResults = await Promise.all(categoryStatsPromises);

  // Build category stats object
  const categoryStats: UserStats['categoryStats'] = {
    History: categoryStatsResults[0],
    Science: categoryStatsResults[1],
    Geography: categoryStatsResults[2],
    'Pop Culture': categoryStatsResults[3],
    Politics: categoryStatsResults[4],
  };

  return {
    currentStreak,
    longestStreak,
    totalQuizzes: totalStats.totalQuizzes,
    totalCorrectAnswers: totalStats.totalCorrect,
    categoryStats,
  };
}
