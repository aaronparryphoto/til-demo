'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShareResults } from '@/components/quiz/ShareResults';
import { StatsPanel } from '@/components/quiz/StatsPanel';
import { CategoryBadge } from '@/components/quiz/CategoryBadge';
import { useDailyQuiz } from '@/hooks/useDailyQuiz';
import { getQuizAttempt, getUserStats, saveQuizAttempt } from '@/lib/quiz-storage';
import { CATEGORY_ORDER, QuizAttempt, UserStats } from '@/lib/types';
import { getQuizAttempt as getQuizAttemptFromServer } from '@/server/actions/quiz-actions';

export default function ResultsPage() {
  const router = useRouter();
  const { date } = useDailyQuiz();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      let loadedAttempt = getQuizAttempt(date);

      // Fallback to server if not in localStorage
      if (!loadedAttempt) {
        const serverAttempt = await getQuizAttemptFromServer(date);
        if (serverAttempt) {
          // Save to localStorage for next time
          saveQuizAttempt(serverAttempt);
          loadedAttempt = serverAttempt;
        }
      }

      const loadedStats = getUserStats();
      setAttempt(loadedAttempt);
      setStats(loadedStats);
      setIsLoading(false);
    }

    loadResults();
  }, [date]);

  // Redirect if not completed yet
  useEffect(() => {
    if (!isLoading && !attempt) {
      router.push('/');
    }
  }, [isLoading, attempt, router]);

  if (isLoading || !attempt || !stats) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-text-secondary">Loading results...</p>
          </div>
        </Container>
      </main>
    );
  }

  const { score, categoryBreakdown } = attempt;
  const percentage = (score / 5) * 100;

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Score card */}
          <Card className="text-center">
            <div className="space-y-4">
              <div className="text-6xl">
                {score === 5 ? '🏆' : score >= 4 ? '🎉' : score >= 3 ? '👍' : '📚'}
              </div>

              <div>
                <h1 className="text-4xl font-bold text-text-primary mb-2">
                  {score} / 5
                </h1>
                <p className="text-text-secondary">
                  {score === 5
                    ? 'Perfect score!'
                    : score >= 4
                    ? 'Great job!'
                    : score >= 3
                    ? 'Good work!'
                    : 'Keep learning!'}
                </p>
              </div>

              <div className="w-full bg-bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className="bg-answer-correct h-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Category breakdown */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Category Breakdown
            </h2>
            <div className="space-y-3">
              {CATEGORY_ORDER.map((category) => {
                const isCorrect = categoryBreakdown[category];
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <CategoryBadge category={category} />
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <span className="text-sm text-answer-correct font-medium">
                            Correct
                          </span>
                          <svg
                            className="w-5 h-5 text-answer-correct"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-answer-incorrect font-medium">
                            Incorrect
                          </span>
                          <svg
                            className="w-5 h-5 text-answer-incorrect"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Share results */}
          <Card>
            <ShareResults attempt={attempt} />
          </Card>

          {/* Stats panel */}
          <StatsPanel stats={stats} />

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button variant="secondary" fullWidth>
                Back to Home
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-text-tertiary">
            Come back tomorrow for a new quiz!
          </p>
        </div>
      </Container>
    </main>
  );
}
