// Hook for fetching daily quiz questions

import { useMemo } from 'react';
import { Question } from '@/lib/types';
import { getTodaysQuestions, getTodayDate } from '@/lib/date-utils';

/**
 * Hook to get today's daily quiz questions
 * @returns { questions, date, isReady }
 */
export function useDailyQuiz() {
  const date = getTodayDate();

  const questions = useMemo<Question[]>(() => {
    try {
      return getTodaysQuestions();
    } catch (error) {
      console.error('Error fetching daily questions:', error);
      return [];
    }
  }, [date]);

  const isReady = questions.length > 0;

  return {
    questions,
    date,
    isReady,
  };
}
