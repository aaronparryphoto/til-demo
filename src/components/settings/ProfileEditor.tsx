// Client component for editing user profile

'use client';

import { useState, useTransition, FormEvent } from 'react';
import { updateUserProfile } from '@/server/actions/user-actions';
import { validateName, validateEmail } from '@/lib/validation/user-validation';
import { Button } from '@/components/ui/Button';
import type { User } from '@/server/db/schema';

interface ProfileEditorProps {
  user: User;
}

export function ProfileEditor({ user }: ProfileEditorProps) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const showEmailWarning = !email.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setErrors({ name: '', email: '' });
    setSuccessMessage('');

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
        setSuccessMessage('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors({ name: 'Failed to update profile. Please try again.', email: '' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Name
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
          className={`w-full px-4 py-2.5 bg-white border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-border-default'
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
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            // Validate on blur if field has value
            if (email.trim()) {
              const validation = validateEmail(email, false);
              setErrors((prev) => ({ ...prev, email: validation.error || '' }));
            }
          }}
          className={`w-full px-4 py-2.5 bg-white border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-border-default'
          }`}
          placeholder="your@email.com"
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Warning message if no email */}
      {showEmailWarning && (
        <div className="flex items-start gap-3 p-3.5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-sm text-yellow-800 leading-relaxed">
            Add an email to save your progress across devices
          </p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="flex items-start gap-3 p-3.5 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-xl flex-shrink-0">✓</span>
          <p className="text-sm text-green-800 leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
