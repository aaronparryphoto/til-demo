// Share results component (Wordle-style)

'use client';

import { useState } from 'react';
import { QuizAttempt } from '@/lib/types';
import { generateShareText, copyToClipboard } from '@/lib/quiz-logic';
import { Button } from '../ui/Button';

interface ShareResultsProps {
  attempt: QuizAttempt;
}

export function ShareResults({ attempt }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = generateShareText(attempt);
    const success = await copyToClipboard(shareText);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleShare}
        variant="secondary"
        fullWidth
        className="relative"
      >
        {copied ? (
          <>
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            Share Results
          </>
        )}
      </Button>

      <p className="text-xs text-text-tertiary text-center">
        Share your score like Wordle!
      </p>
    </div>
  );
}
