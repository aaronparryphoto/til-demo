// Shared validation logic for user profile fields

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const NAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  PATTERN: /^[a-zA-Z\s'-]+$/,
  MESSAGES: {
    REQUIRED: 'Name is required',
    TOO_SHORT: 'Name must be at least 2 characters',
    TOO_LONG: 'Name must be less than 50 characters',
    INVALID_CHARS: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    WHITESPACE: 'Name cannot be only whitespace',
  },
} as const;

export const EMAIL_VALIDATION = {
  PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MESSAGES: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
  },
} as const;

/**
 * Validate a user name
 * @param name - The name to validate
 * @param required - Whether the name is required (default: false)
 * @returns ValidationResult
 */
export function validateName(
  name: string,
  required: boolean = false
): ValidationResult {
  // Trim whitespace
  const trimmedName = name.trim();

  // Check if empty
  if (!trimmedName) {
    if (required) {
      return { valid: false, error: NAME_VALIDATION.MESSAGES.REQUIRED };
    }
    // If not required, empty is valid
    return { valid: true };
  }

  // Check minimum length
  if (trimmedName.length < NAME_VALIDATION.MIN_LENGTH) {
    return { valid: false, error: NAME_VALIDATION.MESSAGES.TOO_SHORT };
  }

  // Check maximum length
  if (trimmedName.length > NAME_VALIDATION.MAX_LENGTH) {
    return { valid: false, error: NAME_VALIDATION.MESSAGES.TOO_LONG };
  }

  // Check pattern
  if (!NAME_VALIDATION.PATTERN.test(trimmedName)) {
    return { valid: false, error: NAME_VALIDATION.MESSAGES.INVALID_CHARS };
  }

  return { valid: true };
}

/**
 * Validate an email address
 * @param email - The email to validate
 * @param required - Whether the email is required (default: false)
 * @returns ValidationResult
 */
export function validateEmail(
  email: string,
  required: boolean = false
): ValidationResult {
  // Trim whitespace
  const trimmedEmail = email.trim();

  // Check if empty
  if (!trimmedEmail) {
    if (required) {
      return { valid: false, error: EMAIL_VALIDATION.MESSAGES.REQUIRED };
    }
    // If not required, empty is valid
    return { valid: true };
  }

  // Check pattern
  if (!EMAIL_VALIDATION.PATTERN.test(trimmedEmail)) {
    return { valid: false, error: EMAIL_VALIDATION.MESSAGES.INVALID };
  }

  return { valid: true };
}
