// Individual answer option button

'use client';

import { AnswerState } from '@/lib/types';

interface AnswerOptionProps {
  option: string;
  index: number; // 0-3
  state: AnswerState;
  onSelect: () => void;
  disabled?: boolean;
}

const stateStyles: Record<AnswerState, string> = {
  idle: 'bg-white border-answer-idle-border hover:bg-answer-hover hover:border-border-strong',
  selected: 'bg-answer-selected border-border-strong',
  correct: 'bg-answer-correct border-answer-correct text-white hover:bg-answer-correct-hover',
  incorrect: 'bg-answer-incorrect border-answer-incorrect text-white',
  revealed: 'bg-white border-answer-idle-border opacity-60',
};

const letters = ['A', 'B', 'C', 'D'];

export function AnswerOption({
  option,
  index,
  state,
  onSelect,
  disabled = false,
}: AnswerOptionProps) {
  const isInteractive = state === 'idle' && !disabled;

  return (
    <button
      onClick={onSelect}
      disabled={disabled || state !== 'idle'}
      className={`
        w-full px-4 py-4 rounded-lg border-2 text-left transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-strong
        disabled:cursor-not-allowed flex items-center gap-3
        ${stateStyles[state]}
        ${!isInteractive && 'cursor-default'}
      `}
    >
      <span
        className={`
        flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm
        ${
          state === 'correct' || state === 'incorrect'
            ? 'bg-white bg-opacity-20 border-white'
            : 'border-current'
        }
      `}
      >
        {letters[index]}
      </span>

      <span className="flex-1 font-medium">{option}</span>

      {/* Checkmark for correct */}
      {state === 'correct' && (
        <svg
          className="w-6 h-6 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      )}

      {/* X for incorrect */}
      {state === 'incorrect' && (
        <svg
          className="w-6 h-6 flex-shrink-0"
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
    </button>
  );
}
