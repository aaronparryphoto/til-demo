// Main quiz state management hook

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, QuizState } from '@/lib/types';
import {
  getCurrentSession,
  saveCurrentSession,
  clearCurrentSession,
} from '@/lib/quiz-storage';
import { hasCompletedToday, submitQuizAttempt } from '@/server/actions/quiz-actions';

interface UseQuizStateProps {
  questions: Question[];
  date: string;
}

export function useQuizState({ questions, date }: UseQuizStateProps) {
  // Initialize state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already completed today
  useEffect(() => {
    async function checkCompletion() {
      const completed = await hasCompletedToday();
      setAlreadyCompleted(completed);
      if (completed) {
        setIsComplete(true);
      }
    }
    checkCompletion();
  }, []);

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

  const completeQuiz = useCallback(async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Calculate score
      const score = answers.filter((a) => a.isCorrect).length;

      // Submit to server
      await submitQuizAttempt({
        date,
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedAnswerIndex: a.selectedAnswerIndex,
          isCorrect: a.isCorrect,
        })),
        score,
      });

      // Clear session
      clearCurrentSession();

      // Mark as complete
      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [date, answers, isSubmitting]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete
      completeQuiz();
    }
  }, [currentQuestionIndex, questions.length, completeQuiz]);

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
    isSubmitting,

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
