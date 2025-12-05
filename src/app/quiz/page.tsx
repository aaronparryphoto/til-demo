'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useDailyQuiz } from '@/hooks/useDailyQuiz';
import { useQuizState } from '@/hooks/useQuizState';

export default function QuizPage() {
  const router = useRouter();
  const { questions, date, isReady } = useDailyQuiz();
  const {
    currentQuestion,
    currentQuestionNumber,
    totalQuestions,
    canProceed,
    isComplete,
    alreadyCompleted,
    handleAnswer,
    nextQuestion,
  } = useQuizState({ questions, date });

  // Handle redirects in useEffect to avoid setState during render
  // Only redirect on fresh completion to avoid redirect loop
  useEffect(() => {
    if (isComplete && !alreadyCompleted) {
      router.push('/results');
    }
  }, [isComplete, alreadyCompleted, router]);

  if (!isReady || !currentQuestion) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-text-secondary">Loading quiz...</p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <ProgressBar
            current={currentQuestionNumber}
            total={totalQuestions}
          />

          {/* Question card */}
          <QuestionCard
            question={currentQuestion}
            onAnswerSubmit={handleAnswer}
          />

          {/* Next button (shown after answering) */}
          {canProceed && (
            <div className="animate-slide-up">
              <Button onClick={nextQuestion} fullWidth>
                {currentQuestionNumber === totalQuestions
                  ? 'View Results'
                  : 'Next Question'}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
