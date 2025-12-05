// Non-dismissible onboarding modal for name and email entry

'use client';

import { useState, useTransition, FormEvent } from 'react';
import { updateUserProfile } from '@/server/actions/user-actions';
import { validateName, validateEmail } from '@/lib/validation/user-validation';
import { Button } from '@/components/ui/Button';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  currentName?: string;
}

export function OnboardingModal({ isOpen, onComplete, currentName = '' }: OnboardingModalProps) {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isPending, startTransition] = useTransition();
  const [showEmailWarning, setShowEmailWarning] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ name: '', email: '' });

    // Optional validation - only validate if fields have values
    const nameValidation = name.trim() ? validateName(name, false) : { valid: true };
    const emailValidation = email.trim() ? validateEmail(email, false) : { valid: true };

    if (!nameValidation.valid || !emailValidation.valid) {
      setErrors({
        name: nameValidation.error || '',
        email: emailValidation.error || '',
      });
      return;
    }

    // Submit to server
    startTransition(async () => {
      try {
        await updateUserProfile({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        });
        onComplete();
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ name: 'Failed to update profile. Please try again.', email: '' });
      }
    });
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      {/* Modal content - non-dismissible */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Welcome to TIL Trivia!
          </h2>
          <p className="text-text-secondary">
            Let&apos;s personalize your experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Name (optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                // Validate on blur if field has value
                if (name.trim()) {
                  const validation = validateName(name, false);
                  setErrors((prev) => ({ ...prev, name: validation.error || '' }));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                errors.name ? 'border-red-500' : 'border-border-default'
              }`}
              placeholder="Enter your name"
              disabled={isPending}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowEmailWarning(!e.target.value.trim());
              }}
              onBlur={() => {
                // Validate on blur if field has value
                if (email.trim()) {
                  const validation = validateEmail(email, false);
                  setErrors((prev) => ({ ...prev, email: validation.error || '' }));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                errors.email ? 'border-red-500' : 'border-border-default'
              }`}
              placeholder="your@email.com"
              disabled={isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Warning message */}
          {showEmailWarning && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <span className="text-yellow-600 flex-shrink-0">⚠️</span>
              <p className="text-sm text-yellow-800">
                Without an email, your progress won&apos;t be saved if you lose your session
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
              disabled={isPending}
              fullWidth
            >
              Skip
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              fullWidth
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
