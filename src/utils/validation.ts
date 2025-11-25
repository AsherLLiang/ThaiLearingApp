// src/utils/validation.ts
/**
 * Frontend Validation Utilities
 * 
 * Purpose: Centralized validation logic for forms
 * Used by: All form components (Login, Register, etc.)
 * 
 * Philosophy: 
 * - Frontend validation for UX (instant feedback)
 * - Backend validation for security (trust nothing from client)
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters',
    };
  }

  // Optional: Check for password strength
  // const hasNumber = /\d/.test(password);
  // const hasLetter = /[a-zA-Z]/.test(password);
  // if (!hasNumber || !hasLetter) {
  //   return {
  //     isValid: false,
  //     error: 'Password must contain letters and numbers',
  //   };
  // }

  return { isValid: true };
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string): ValidationResult {
  if (!name) {
    return {
      isValid: false,
      error: 'Display name is required',
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      error: 'Display name must be at least 2 characters',
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: 'Display name must be less than 50 characters',
    };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return { isValid: true };
}

/**
 * Validate registration form
 */
export function validateRegistrationForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}): ValidationResult {
  // Validate display name
  const nameResult = validateDisplayName(data.displayName);
  if (!nameResult.isValid) return nameResult;

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) return emailResult;

  // Validate password
  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) return passwordResult;

  // Validate password match
  const matchResult = validatePasswordMatch(data.password, data.confirmPassword);
  if (!matchResult.isValid) return matchResult;

  return { isValid: true };
}

/**
 * Validate login form
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) return emailResult;

  // Validate password exists
  if (!data.password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  return { isValid: true };
}

/**
 * Real-time validation helpers for form inputs
 * Use these with onChange handlers for instant feedback
 */
export const realtimeValidators = {
  email: (email: string): string | undefined => {
    if (!email) return undefined; // Don't show error for empty field
    const result = validateEmail(email);
    return result.isValid ? undefined : result.error;
  },

  password: (password: string): string | undefined => {
    if (!password) return undefined;
    const result = validatePassword(password);
    return result.isValid ? undefined : result.error;
  },

  displayName: (name: string): string | undefined => {
    if (!name) return undefined;
    const result = validateDisplayName(name);
    return result.isValid ? undefined : result.error;
  },

  confirmPassword: (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return undefined;
    const result = validatePasswordMatch(password, confirmPassword);
    return result.isValid ? undefined : result.error;
  },
};
