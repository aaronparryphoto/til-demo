// Hook for fetching daily quiz questions

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { getTodaysQuestions, type QuestionData } from '@/server/actions/quiz-actions';
import { getTodayDate } from '@/lib/date-utils';

/**
 * Hook to get today's daily quiz questions
 * @returns { questions, date, isReady }
 */
export function useDailyQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const date = getTodayDate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true);
        const data = await getTodaysQuestions();

        // Transform QuestionData to Question format
        const transformedQuestions: Question[] = data.map((q: QuestionData) => ({
          id: q.id,
          category: q.category,
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation,
          difficulty: q.difficulty,
        }));

        setQuestions(transformedQuestions);
      } catch (error) {
        console.error('Error fetching daily questions:', error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [date]);

  const isReady = !isLoading && questions.length > 0;

  return {
    questions,
    date,
    isReady,
    isLoading,
  };
}
