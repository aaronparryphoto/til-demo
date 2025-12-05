// Detailed results summary component (optional for review)

import { QuizAttempt, Question } from '@/lib/types';
import { Card } from '../ui/Card';
import { CategoryBadge } from './CategoryBadge';

interface ResultsSummaryProps {
  attempt: QuizAttempt;
  questions: Question[];
}

export function ResultsSummary({ attempt, questions }: ResultsSummaryProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Question Review
      </h2>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const answer = attempt.answers[index];
          const isCorrect = answer?.isCorrect;

          return (
            <div
              key={question.id}
              className={`p-4 rounded-lg border-2 ${
                isCorrect
                  ? 'border-answer-correct bg-answer-correct bg-opacity-5'
                  : 'border-answer-incorrect bg-answer-incorrect bg-opacity-5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <CategoryBadge category={question.category} />
                <div className="flex items-center gap-1">
                  {isCorrect ? (
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
                  ) : (
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
                  )}
                </div>
              </div>

              <p className="font-medium text-text-primary mb-2">
                {question.questionText}
              </p>

              <div className="space-y-1 text-sm">
                <p className="text-text-secondary">
                  <span className="font-medium">Your answer:</span>{' '}
                  {answer ? question.options[answer.selectedAnswerIndex] : 'N/A'}
                </p>
                {!isCorrect && (
                  <p className="text-text-secondary">
                    <span className="font-medium">Correct answer:</span>{' '}
                    {question.options[question.correctAnswerIndex]}
                  </p>
                )}
              </div>

              {question.explanation && (
                <p className="mt-2 text-sm text-text-secondary italic">
                  {question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
