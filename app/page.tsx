'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDailyQuiz } from '@/hooks/useDailyQuiz';
import { getQuizAttempt } from '@/lib/quiz-storage';
import { formatDate } from '@/lib/date-utils';
import { QuizAttempt } from '@/lib/types';

export default function Home() {
  const { date, isReady } = useDailyQuiz();
  const [todayAttempt, setTodayAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attempt = getQuizAttempt(date);
    setTodayAttempt(attempt);
    setIsLoading(false);
  }, [date]);

  const hasCompletedToday = !!todayAttempt;

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">
              TIL Trivia
            </h1>
            <p className="text-lg text-text-secondary">
              Test your knowledge with 5 daily questions
            </p>
            <p className="text-sm text-text-tertiary">
              {formatDate(date)}
            </p>
          </div>

          {/* Main CTA */}
          <Card className="text-center">
            {isLoading ? (
              <div className="py-8">
                <p className="text-text-secondary">Loading...</p>
              </div>
            ) : hasCompletedToday ? (
              <div className="space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-semibold text-text-primary">
                  You&apos;ve completed today&apos;s quiz!
                </h2>
                <p className="text-text-secondary">
                  You scored {todayAttempt.score} out of 5
                </p>
                <div className="pt-4">
                  <Link href="/results">
                    <Button variant="primary">View Results</Button>
                  </Link>
                </div>
                <p className="text-sm text-text-tertiary">
                  Come back tomorrow for a new quiz!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary mb-2">
                    Ready to play?
                  </h2>
                  <p className="text-text-secondary">
                    Answer 5 questions across different categories
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {['History', 'Science', 'Geography', 'Pop Culture', 'Politics'].map(
                    (category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-sm"
                      >
                        {category}
                      </span>
                    )
                  )}
                </div>

                <Link href="/quiz">
                  <Button variant="primary" fullWidth disabled={!isReady}>
                    {isReady ? "Start Today's Quiz" : 'Loading...'}
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* How it works */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              How it works
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>Answer 5 multiple choice questions, one from each category</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>Get instant feedback and explanations for each answer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>Track your streaks and share your results</span>
              </li>
            </ul>
          </Card>
        </div>
      </Container>
    </main>
  );
}
