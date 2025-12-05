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
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { needsOnboarding, getCurrentUser } from '@/server/actions/user-actions';

export default function Home() {
  const { date, isReady } = useDailyQuiz();
  const [todayAttempt, setTodayAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const attempt = getQuizAttempt(date);
    setTodayAttempt(attempt);
    setIsLoading(false);
  }, [date]);

  // Check if user needs onboarding
  useEffect(() => {
    async function checkOnboarding() {
      const needs = await needsOnboarding();
      if (needs) {
        const user = await getCurrentUser();
        setCurrentUserName(user?.name || '');
        setShowOnboardingModal(true);
      }
    }
    checkOnboarding();
  }, []);

  const hasCompletedToday = !!todayAttempt;

  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);
  };

  return (
    <>
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onComplete={handleOnboardingComplete}
        currentName={currentUserName}
      />

      <main className="min-h-screen py-12 sm:py-16">
        <Container>
        <div className="max-w-2xl mx-auto space-y-10">
          {/* Hero section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary heading-display">
              TIL Trivia
            </h1>
            <p className="text-xl text-text-secondary font-medium">
              Test your knowledge with 5 daily questions
            </p>
            <p className="text-base text-text-tertiary">
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
              <div className="space-y-6">
                <div className="text-7xl">🎉</div>
                <h2 className="text-3xl font-bold text-text-primary">
                  You&apos;ve completed today&apos;s quiz!
                </h2>
                <p className="text-lg text-text-secondary">
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
                  <h2 className="text-3xl font-bold text-text-primary mb-3">
                    Ready to play?
                  </h2>
                  <p className="text-lg text-text-secondary">
                    Answer 5 questions across different categories
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {['History', 'Science', 'Geography', 'Pop Culture', 'Politics'].map(
                    (category) => (
                      <span
                        key={category}
                        className="px-4 py-2 bg-bg-secondary text-text-secondary rounded-badge text-sm font-semibold border border-border-light hover:border-border-default transition-colors"
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
            <h3 className="text-xl font-bold text-text-primary mb-6">
              How it works
            </h3>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center text-base font-bold">
                  1
                </span>
                <span className="pt-1">Answer 5 multiple choice questions, one from each category</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center text-base font-bold">
                  2
                </span>
                <span className="pt-1">Get instant feedback and explanations for each answer</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center text-base font-bold">
                  3
                </span>
                <span className="pt-1">Track your streaks and share your results</span>
              </li>
            </ul>
          </Card>
        </div>
      </Container>
    </main>
    </>
  );
}
