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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
      {/* Modal content - non-dismissible */}
      <div className="relative bg-white rounded-card shadow-elevated max-w-md w-full p-8 my-8 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-3 heading-title">
            Welcome to TIL Trivia!
          </h2>
          <p className="text-base text-text-secondary">
            Let&apos;s personalize your experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
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
              className={`w-full px-4 py-3.5 bg-white border-2 rounded-button text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all ${
                errors.name ? 'border-accent-error' : 'border-border-default'
              }`}
              placeholder="Enter your name"
              disabled={isPending}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
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
              className={`w-full px-4 py-3.5 bg-white border-2 rounded-button text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all ${
                errors.email ? 'border-accent-error' : 'border-border-default'
              }`}
              placeholder="your@email.com"
              disabled={isPending}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Warning message */}
          {showEmailWarning && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-button">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Without an email, your progress won&apos;t be saved if you lose your session
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
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
