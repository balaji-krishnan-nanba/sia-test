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
 * Individual exam specification - reflects real SIA exam structure
 * Note: SIA exams are structured as separate exam papers, not per-unit
 */
export interface ExamPaperSpec {
  examNumber: number;
  examName: string;
  unitsCovered: number[]; // Which units this exam covers
  questions: number;
  timeMinutes: number;
  passingScore: number; // percentage (70% standard, 80% for CP Unit 7)
}

/**
 * Exam information with exam paper breakdown
 * Based on official SIA/Highfield qualification specifications
 */
export interface ExamInfo {
  slug: ExamSlug;
  code: SIAQualification;
  name: string;
  description: string;
  totalMcqQuestions: number; // Total MCQ questions across all exam papers
  totalUnits: number;
  totalTimeMinutes: number; // Total time across all exam papers
  examPapers: ExamPaperSpec[]; // Individual exam papers
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
 * Based on official SIA/Highfield qualification specifications
 * Source: docs/EXAMS.md and Questions/SIA-ALL-QUALIFICATIONS-MASTER-README.txt
 *
 * IMPORTANT: These reflect the ACTUAL exam structure used by awarding bodies.
 * - Door Supervisor: 2 MCQ exams (60 total questions, 90 minutes)
 * - Security Guard: 2 MCQ exams (40 total questions, 60 minutes)
 * - CCTV Operator: 2 MCQ exams (40 total questions, 60 minutes)
 * - Close Protection: 4 MCQ exams (132 total questions, 200 minutes)
 */
export const EXAM_DETAILS: Record<ExamSlug, ExamInfo> = {
  'door-supervisor': {
    slug: 'door-supervisor',
    code: 'DS',
    name: 'Door Supervisor',
    description: 'Level 2 Award for Door Supervisors in the Private Security Industry',
    totalMcqQuestions: 60,
    totalUnits: 4,
    totalTimeMinutes: 90,
    examPapers: [
      {
        examNumber: 1,
        examName: 'Working in Private Security & Conflict Management',
        unitsCovered: [1, 3],
        questions: 40,
        timeMinutes: 60,
        passingScore: 70, // 28/40 to pass
      },
      {
        examNumber: 2,
        examName: 'Working as a Door Supervisor',
        unitsCovered: [2],
        questions: 20,
        timeMinutes: 30,
        passingScore: 70, // 14/20 to pass
      },
      // Note: Unit 4 (Physical Intervention) is assessed via practical demonstration
    ],
  },
  'security-guard': {
    slug: 'security-guard',
    code: 'SG',
    name: 'Security Guard',
    description: 'Level 2 Award for Security Officers (Guarding) in the Private Security Industry',
    totalMcqQuestions: 40,
    totalUnits: 3,
    totalTimeMinutes: 60,
    examPapers: [
      {
        examNumber: 1,
        examName: 'Working in Private Security & Conflict Management',
        unitsCovered: [1, 3],
        questions: 20,
        timeMinutes: 30,
        passingScore: 70, // 14/20 to pass
      },
      {
        examNumber: 2,
        examName: 'Working as a Security Officer',
        unitsCovered: [2],
        questions: 20,
        timeMinutes: 30,
        passingScore: 70, // 14/20 to pass
      },
    ],
  },
  'cctv-operator': {
    slug: 'cctv-operator',
    code: 'CCTV',
    name: 'CCTV Operator',
    description: 'Level 2 Award for Working as a CCTV Operator (Public Space Surveillance)',
    totalMcqQuestions: 40,
    totalUnits: 2,
    totalTimeMinutes: 60,
    examPapers: [
      {
        examNumber: 1,
        examName: 'Working in the Private Security Industry',
        unitsCovered: [1],
        questions: 20,
        timeMinutes: 30,
        passingScore: 70, // 14/20 to pass
      },
      {
        examNumber: 2,
        examName: 'Working as a CCTV Operator',
        unitsCovered: [2],
        questions: 20,
        timeMinutes: 30,
        passingScore: 70, // 14/20 to pass
      },
    ],
  },
  'close-protection': {
    slug: 'close-protection',
    code: 'CP',
    name: 'Close Protection',
    description: 'Level 3 Certificate for Working as a Close Protection Operative',
    totalMcqQuestions: 132,
    totalUnits: 7,
    totalTimeMinutes: 200,
    examPapers: [
      {
        examNumber: 1,
        examName: 'Principles of Working as a CPO',
        unitsCovered: [1],
        questions: 52,
        timeMinutes: 80,
        passingScore: 70, // 37/52 to pass
      },
      {
        examNumber: 2,
        examName: 'Working as a CPO',
        unitsCovered: [2],
        questions: 30,
        timeMinutes: 45,
        passingScore: 70, // 21/30 to pass
      },
      {
        examNumber: 3,
        examName: 'Conflict Management for CP',
        unitsCovered: [3],
        questions: 20,
        timeMinutes: 30,
        passingScore: 70, // 14/20 to pass
      },
      {
        examNumber: 4,
        examName: 'Physical Intervention Skills',
        unitsCovered: [7],
        questions: 30,
        timeMinutes: 45,
        passingScore: 80, // 24/30 to pass - ELEVATED due to critical safety content
      },
      // Note: Units 4, 5, 6 are assessed via portfolio/practical, not MCQ
    ],
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
