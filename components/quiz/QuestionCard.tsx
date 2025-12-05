// Question card with answer options

'use client';

import { useState } from 'react';
import { Question, AnswerState } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';
import { AnswerOption } from './AnswerOption';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (selectedIndex: number, isCorrect: boolean) => void;
}

export function QuestionCard({ question, onAnswerSubmit }: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isRevealed) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null || isRevealed) return;

    const isCorrect = selectedIndex === question.correctAnswerIndex;
    setIsRevealed(true);

    // Call callback after brief delay for animation
    setTimeout(() => {
      onAnswerSubmit(selectedIndex, isCorrect);
    }, 500);
  };

  const getAnswerState = (index: number): AnswerState => {
    if (!isRevealed) {
      return selectedIndex === index ? 'selected' : 'idle';
    }

    // After reveal
    if (index === question.correctAnswerIndex) {
      return 'correct';
    }

    if (index === selectedIndex && selectedIndex !== question.correctAnswerIndex) {
      return 'incorrect';
    }

    return 'revealed';
  };

  return (
    <Card className="animate-slide-up">
      <div className="space-y-6">
        {/* Category badge */}
        <div>
          <CategoryBadge category={question.category} />
        </div>

        {/* Question text */}
        <h2 className="text-2xl font-semibold text-text-primary leading-tight">
          {question.questionText}
        </h2>

        {/* Answer options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              option={option}
              index={index}
              state={getAnswerState(index)}
              onSelect={() => handleOptionSelect(index)}
              disabled={isRevealed}
            />
          ))}
        </div>

        {/* Explanation (shown after reveal) */}
        {isRevealed && question.explanation && (
          <div className="mt-4 p-4 bg-bg-secondary rounded-lg animate-fade-in">
            <p className="text-sm text-text-secondary leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Submit button */}
        {!isRevealed && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            fullWidth
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
}
