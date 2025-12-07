/**
 * Application constants
 */

import type { SubscriptionTier } from '@/types/subscription';
import type { SIAQualification } from '@/types/question';

/**
 * Exam slug type
 */
export type ExamSlug = 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection';

/**
 * Exam information
 */
export interface ExamInfo {
  slug: ExamSlug;
  code: SIAQualification;
  name: string;
  description: string;
  totalQuestions: number;
  passingScore: number; // percentage
  timeLimit: number; // in minutes
  units: number;
}

/**
 * Exam slugs constants
 */
export const EXAM_SLUGS = {
  DOOR_SUPERVISOR: 'door-supervisor',
  SECURITY_GUARD: 'security-guard',
  CCTV_OPERATOR: 'cctv-operator',
  CLOSE_PROTECTION: 'close-protection',
} as const;

/**
 * Exam details for each qualification
 */
export const EXAM_DETAILS: Record<ExamSlug, ExamInfo> = {
  'door-supervisor': {
    slug: 'door-supervisor',
    code: 'DS',
    name: 'Door Supervisor',
    description: 'SIA Door Supervisor Licence qualification',
    totalQuestions: 50,
    passingScore: 70,
    timeLimit: 90, // 90 minutes
    units: 4,
  },
  'security-guard': {
    slug: 'security-guard',
    code: 'SG',
    name: 'Security Guard',
    description: 'SIA Security Guard Licence qualification',
    totalQuestions: 40,
    passingScore: 70,
    timeLimit: 75, // 75 minutes
    units: 3,
  },
  'cctv-operator': {
    slug: 'cctv-operator',
    code: 'CCTV',
    name: 'CCTV Operator',
    description: 'SIA CCTV Operator (Public Space Surveillance) Licence qualification',
    totalQuestions: 45,
    passingScore: 70,
    timeLimit: 80, // 80 minutes
    units: 3,
  },
  'close-protection': {
    slug: 'close-protection',
    code: 'CP',
    name: 'Close Protection',
    description: 'SIA Close Protection Operative Licence qualification',
    totalQuestions: 60,
    passingScore: 75,
    timeLimit: 120, // 120 minutes
    units: 5,
  },
};

/**
 * Difficulty levels
 */
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sia_auth_token',
  USER_PREFERENCES: 'sia_user_preferences',
  QUIZ_STATE: 'sia_quiz_state',
  MOCK_EXAM_STATE: 'sia_mock_exam_state',
  LAST_EXAM: 'sia_last_exam',
  THEME: 'sia_theme',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  QUIZ: '/quiz',
  // Exam-specific routes
  EXAM: '/exam/:examSlug',
  EXAM_PRACTICE: '/exam/:examSlug/practice',
  EXAM_MOCK: '/exam/:examSlug/mock',
  EXAM_MOCK_TEST: '/exam/:examSlug/mock/:testNumber',
} as const;

/**
 * API endpoints (relative to Supabase base URL)
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNIN: '/auth/v1/token',
  AUTH_SIGNUP: '/auth/v1/signup',
  AUTH_SIGNOUT: '/auth/v1/logout',
  AUTH_USER: '/auth/v1/user',

  // Questions
  QUESTIONS: '/rest/v1/questions',
  QUESTION_ATTEMPTS: '/rest/v1/question_attempts',

  // Progress
  USER_PROGRESS: '/rest/v1/user_progress',
  DAILY_ACTIVITIES: '/rest/v1/daily_activities',

  // Mock Exams
  MOCK_EXAMS: '/rest/v1/mock_exam_attempts',

  // Subscription
  SUBSCRIPTIONS: '/rest/v1/subscriptions',
  STRIPE_CHECKOUT: '/functions/v1/create-checkout-session',
  STRIPE_PORTAL: '/functions/v1/create-portal-session',
} as const;

/**
 * Subscription tier limits
 */
export const SUBSCRIPTION_LIMITS: Record<
  SubscriptionTier,
  {
    mockExamsPerMonth: number;
    qualifications: number;
    features: string[];
  }
> = {
  free: {
    mockExamsPerMonth: 2,
    qualifications: 1,
    features: [
      'Access to 1 qualification',
      '2 mock exams per month',
      'Basic progress tracking',
    ],
  },
  basic: {
    mockExamsPerMonth: 10,
    qualifications: 2,
    features: [
      'Access to 2 qualifications',
      '10 mock exams per month',
      'Detailed progress analytics',
      'Study planner',
      'Ad-free experience',
    ],
  },
  premium: {
    mockExamsPerMonth: -1, // unlimited
    qualifications: -1, // unlimited
    features: [
      'Access to all qualifications',
      'Unlimited mock exams',
      'Advanced performance analytics',
      'Personalized study recommendations',
      'Download certificates',
      'Priority support',
      'Ad-free experience',
    ],
  },
};

/**
 * Quiz/Exam settings
 */
export const QUIZ_SETTINGS = {
  DEFAULT_QUESTIONS_PER_QUIZ: 20,
  DEFAULT_TIME_PER_QUESTION: 60, // seconds
  PASSING_SCORE_PERCENTAGE: 70,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
} as const;

/**
 * Timing constants
 */
export const TIMING = {
  MOCK_EXAM_DURATION: {
    'door-supervisor': 90 * 60, // 90 minutes in seconds
    'security-guard': 75 * 60, // 75 minutes in seconds
    'cctv-operator': 80 * 60, // 80 minutes in seconds
    'close-protection': 120 * 60, // 120 minutes in seconds
  },
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT: 3600000, // 1 hour
  DEBOUNCE_DELAY: 300, // 300ms for search inputs
} as const;

/**
 * Performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  STRONG: 80, // percentage
  WEAK: 60, // percentage
  READY_FOR_EXAM: 75, // percentage
  EXCELLENT: 90, // percentage
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Question display settings
 */
export const QUESTION_DISPLAY = {
  SHOW_EXPLANATION_AFTER_ANSWER: true,
  ALLOW_REVIEW_BEFORE_SUBMIT: true,
  SHUFFLE_QUESTIONS_DEFAULT: true,
  SHUFFLE_ANSWERS_DEFAULT: true,
} as const;
