/**
 * Validation utilities for data validation
 */

import type { Question, ExamConfig } from '@/types/question';

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Email validation regex
 * RFC 5322 compliant email validation
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email address
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim();

  // Basic format check
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return false;
  }

  // Additional checks
  if (trimmedEmail.length > 254) {
    return false; // Max email length per RFC 5321
  }

  const [localPart, domain] = trimmedEmail.split('@');

  // Local part should not exceed 64 characters
  if (localPart!.length > 64) {
    return false;
  }

  // Domain should not exceed 253 characters
  if (domain!.length > 253) {
    return false;
  }

  return true;
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @param options - Validation options
 * @returns Validation result with strength score
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): ValidationResult & { strength: 'weak' | 'medium' | 'strong' } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  const errors: string[] = [];
  let strengthScore = 0;

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 'weak',
    };
  }

  // Length check
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  } else {
    strengthScore++;
  }

  // Uppercase check
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    strengthScore++;
  }

  // Lowercase check
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    strengthScore++;
  }

  // Number check
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    strengthScore++;
  }

  // Special character check
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strengthScore++;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (strengthScore <= 2) {
    strength = 'weak';
  } else if (strengthScore <= 3) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Validate question data
 * @param question - Question object to validate
 * @returns Validation result
 */
export function validateQuestionData(question: Question): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!question.id) {
    errors.push('Question ID is required');
  }

  if (!question.qualification) {
    errors.push('Qualification is required');
  }

  if (!question.unitId) {
    errors.push('Unit ID is required');
  }

  if (!question.chapterId) {
    errors.push('Chapter ID is required');
  }

  if (!question.questionText || question.questionText.trim().length === 0) {
    errors.push('Question text is required');
  }

  // Validate question text length
  if (question.questionText && question.questionText.length < 10) {
    warnings.push('Question text seems too short');
  }

  // Validate options
  if (!question.options || question.options.length === 0) {
    errors.push('Question must have answer options');
  } else {
    // Check for multiple choice questions
    if (question.type === 'multiple-choice') {
      if (question.options.length < 2) {
        errors.push('Multiple choice questions must have at least 2 options');
      }

      if (question.options.length > 6) {
        warnings.push('Too many answer options (recommended: 2-6)');
      }

      // Check if each option has text
      question.options.forEach((option, index) => {
        if (!option.text || option.text.trim().length === 0) {
          errors.push(`Option ${index + 1} is missing text`);
        }
      });

      // Check if exactly one option is marked as correct
      const correctCount = question.options.filter((o) => o.isCorrect).length;
      if (correctCount === 0) {
        errors.push('No correct answer specified');
      } else if (correctCount > 1) {
        warnings.push('Multiple correct answers specified');
      }
    }
  }

  // Validate difficulty
  if (!question.difficulty) {
    errors.push('Difficulty level is required');
  } else if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push('Invalid difficulty level');
  }

  // Check explanation
  if (!question.explanation || question.explanation.trim().length === 0) {
    warnings.push('No explanation provided');
  } else if (question.explanation.length < 20) {
    warnings.push('Explanation seems too short');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate exam configuration
 * @param config - Exam config to validate
 * @returns Validation result
 */
export function validateExamConfig(config: ExamConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!config.id) {
    errors.push('Exam config ID is required');
  }

  if (!config.qualification) {
    errors.push('Qualification is required');
  }

  // Validate total questions
  if (!config.totalQuestions || config.totalQuestions <= 0) {
    errors.push('Total questions must be greater than 0');
  } else {
    if (config.totalQuestions < 10) {
      warnings.push('Too few questions for a meaningful exam');
    }
    if (config.totalQuestions > 200) {
      warnings.push('Too many questions may be overwhelming');
    }
  }

  // Validate passing score
  if (config.passingScore === undefined || config.passingScore === null) {
    errors.push('Passing score is required');
  } else {
    if (config.passingScore < 0 || config.passingScore > 100) {
      errors.push('Passing score must be between 0 and 100');
    }
    if (config.passingScore < 50) {
      warnings.push('Passing score is very low');
    }
    if (config.passingScore > 90) {
      warnings.push('Passing score is very high');
    }
  }

  // Validate time limit
  if (!config.timeLimit || config.timeLimit <= 0) {
    errors.push('Time limit must be greater than 0');
  } else {
    if (config.timeLimit < 10) {
      warnings.push('Time limit is very short');
    }
    if (config.timeLimit > 240) {
      // 4 hours
      warnings.push('Time limit is very long');
    }

    // Check if time limit is reasonable for number of questions
    const minutesPerQuestion = config.timeLimit / config.totalQuestions;
    if (minutesPerQuestion < 0.5) {
      warnings.push('Less than 30 seconds per question may be too rushed');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if URL is valid
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate phone number (UK format)
 * @param phone - Phone number to validate
 * @returns True if phone number is valid
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove spaces and common separators
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // UK phone number patterns
  const ukMobileRegex = /^(\+44|0)7\d{9}$/;
  const ukLandlineRegex = /^(\+44|0)[1-9]\d{9}$/;

  return ukMobileRegex.test(cleaned) || ukLandlineRegex.test(cleaned);
}

/**
 * Validate date string
 * @param dateString - Date string to validate
 * @returns True if date string is valid
 */
export function validateDate(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate that a value is within a numeric range
 * @param value - Value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
}

/**
 * Validate required fields in an object
 * @param obj - Object to validate
 * @param requiredFields - Array of required field names
 * @returns Validation result
 */
export function validateRequiredFields(
  obj: Record<string, any>,
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      errors.push(`${field} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
