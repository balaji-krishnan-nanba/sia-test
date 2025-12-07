/**
 * Hooks - Central export for all custom React hooks
 */

export { useLocalStorage, useSessionStorage } from './useLocalStorage';
export { useQuestions, useFilteredQuestions } from './useQuestions';
export { useQuizSession } from './useQuizSession';
export { useMockExam } from './useMockExam';
export {
  useProgress,
  useStreak,
  usePerformanceStats,
  useDailyActivities,
  useRecentAttempts,
} from './useProgress';

// Re-export types
export type { UseQuestionsResult } from './useQuestions';
export type { UseQuizSessionResult, QuizQuestion, QuizSessionState } from './useQuizSession';
export type { UseMockExamResult, MockExamResult } from './useMockExam';
export type { UseProgressResult } from './useProgress';
