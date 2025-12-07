/**
 * Utilities - Central export for all utility functions
 */

// Class name utility
export { cn } from './cn';

// Date utilities
export {
  formatDate,
  formatRelativeTime,
  getRelativeTime,
  formatDuration,
  formatTimer,
  isToday,
  wasYesterday,
  isSameDay,
  getDaysBetween,
  getDateRange,
} from './date';

// Constants
export {
  EXAM_SLUGS,
  EXAM_DETAILS,
  DIFFICULTY_LEVELS,
  STORAGE_KEYS,
  ROUTES,
  API_ENDPOINTS,
  SUBSCRIPTION_LIMITS,
  QUIZ_SETTINGS,
  TIMING,
  PERFORMANCE_THRESHOLDS,
  ANIMATION_DURATIONS,
  PAGINATION,
  QUESTION_DISPLAY,
} from './constants';

export type { ExamSlug, ExamInfo } from './constants';

// Question randomizer
export {
  shuffleQuestions,
  generateQuiz,
  generateMockExam,
  generateChapterQuiz,
  generateDifficultyQuiz,
  getQuestionStats,
} from './questionRandomizer';

export type { QuizOptions } from './questionRandomizer';

// Scorer
export {
  checkAnswer,
  calculateAccuracy,
  calculateUnitBreakdown,
  getPerformanceStats,
  identifyWeakAreas,
  calculateCorrectStreak,
  calculatePassRate,
  getPerformanceTrend,
} from './scorer';

export type {
  QuestionAttempt,
  UnitBreakdown,
  PerformanceStats,
  WeakArea,
} from './scorer';

// Progress tracker
export {
  saveQuestionAttempt,
  getUserProgress,
  getAttemptHistory,
  getAllAttempts,
  calculateStreak,
  getDailyActivities,
  clearProgressCache,
  saveMockExamResult,
} from './progressTracker';

export type { StreakData } from './progressTracker';

// Validation
export {
  validateEmail,
  validatePassword,
  validateQuestionData,
  validateExamConfig,
  validateUrl,
  validatePhoneNumber,
  validateDate,
  sanitizeInput,
  isInRange,
  validateRequiredFields,
} from './validation';

export type { ValidationResult } from './validation';

// Storage
export {
  setItem,
  getItem,
  getItemWithDefault,
  removeItem,
  clearAll,
  clearByPrefix,
  hasItem,
  getAllKeys,
  getStorageSize,
  getStorageSizeFormatted,
  setItemWithExpiry,
  getItemWithExpiry,
  safeStorage,
  addStorageListener,
  setItemWithNotification,
  StorageError,
} from './storage';
