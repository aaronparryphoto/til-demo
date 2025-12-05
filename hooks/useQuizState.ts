// Main quiz state management hook

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, QuizState, UserStats } from '@/lib/types';
import {
  getCurrentSession,
  saveCurrentSession,
  clearCurrentSession,
  getUserStats,
  saveUserStats,
  saveQuizAttempt,
  getQuizAttempt,
} from '@/lib/quiz-storage';
import { createQuizAttempt, updateStats } from '@/lib/quiz-logic';
import { getTodayDate } from '@/lib/date-utils';

interface UseQuizStateProps {
  questions: Question[];
  date: string;
}

export function useQuizState({ questions, date }: UseQuizStateProps) {
  // Check if already completed today
  const todayAttempt = getQuizAttempt(date);
  const alreadyCompleted = !!todayAttempt;

  // Initialize state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(alreadyCompleted);
  const [stats, setStats] = useState<UserStats>(getUserStats());

  // Load existing session if available and not completed
  useEffect(() => {
    if (alreadyCompleted) {
      return;
    }

    const session = getCurrentSession();
    if (session && !session.isComplete) {
      setCurrentQuestionIndex(session.currentQuestionIndex);
      setAnswers(session.answers);
    }
  }, [alreadyCompleted]);

  // Save session to localStorage whenever state changes
  useEffect(() => {
    if (!alreadyCompleted && !isComplete) {
      const session: QuizState = {
        currentQuestionIndex,
        answers,
        startedAt: new Date().toISOString(),
        isComplete: false,
      };
      saveCurrentSession(session);
    }
  }, [currentQuestionIndex, answers, isComplete, alreadyCompleted]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = useCallback(
    (selectedIndex: number, isCorrect: boolean) => {
      if (!currentQuestion) return;

      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswerIndex: selectedIndex,
        isCorrect,
      };

      setAnswers(prev => [...prev, answer]);
    },
    [currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete
      completeQuiz();
    }
  }, [currentQuestionIndex, questions.length]);

  const completeQuiz = useCallback(() => {
    const attempt = createQuizAttempt(date, answers, questions);

    // Save attempt
    saveQuizAttempt(attempt);

    // Update stats
    const newStats = updateStats(stats, attempt);
    saveUserStats(newStats);
    setStats(newStats);

    // Clear session
    clearCurrentSession();

    // Mark as complete
    setIsComplete(true);
  }, [date, answers, questions, stats]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsComplete(false);
    clearCurrentSession();
  }, []);

  return {
    // Current state
    currentQuestion,
    currentQuestionIndex,
    answers,
    isComplete,
    alreadyCompleted,
    stats,

    // Actions
    handleAnswer,
    nextQuestion,
    completeQuiz,
    resetQuiz,

    // Computed
    totalQuestions: questions.length,
    currentQuestionNumber: currentQuestionIndex + 1,
    canProceed: answers.length > currentQuestionIndex,
  };
}
