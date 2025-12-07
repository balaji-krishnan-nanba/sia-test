/**
 * useProgress Hook - Fetch and manage user progress data
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '@/types/progress';
import type { SIAQualification } from '@/types/question';
import {
  getUserProgress,
  getAllAttempts,
  calculateStreak,
  getDailyActivities,
  type StreakData,
} from '@/utils/progressTracker';
import {
  getPerformanceStats,
  identifyWeakAreas,
  type PerformanceStats,
  type WeakArea,
  type QuestionAttempt,
} from '@/utils/scorer';

export interface UseProgressResult {
  progress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage user progress
 * @param userId - The user ID
 * @param examSlug - The exam/qualification slug (optional)
 * @returns User progress data
 *
 * @example
 * const { progress, isLoading, refresh } = useProgress(userId, 'door-supervisor');
 */
export function useProgress(userId: string, examSlug?: string): UseProgressResult {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userId) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserProgress(userId, examSlug || '');
      setProgress(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load progress';
      setError(errorMessage);
      console.error('Error loading progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, examSlug]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const refresh = useCallback(async () => {
    await fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    isLoading,
    error,
    refresh,
  };
}

/**
 * Hook to fetch user's study streak
 * @param userId - The user ID
 * @returns Streak data
 */
export function useStreak(userId: string): {
  streak: StreakData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!userId) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await calculateStreak(userId);
      setStreak(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load streak';
      setError(errorMessage);
      console.error('Error loading streak:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const refresh = useCallback(async () => {
    await fetchStreak();
  }, [fetchStreak]);

  return {
    streak,
    isLoading,
    error,
    refresh,
  };
}

/**
 * Hook to fetch performance statistics
 * @param userId - The user ID
 * @param qualification - Optional qualification filter
 * @returns Performance stats
 */
export function usePerformanceStats(
  userId: string,
  qualification?: SIAQualification
): {
  stats: PerformanceStats | null;
  weakAreas: WeakArea[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const attempts = await getAllAttempts(userId, qualification);
      const performanceStats = getPerformanceStats(attempts);
      const weak = identifyWeakAreas(attempts);

      setStats(performanceStats);
      setWeakAreas(weak);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics';
      setError(errorMessage);
      console.error('Error loading performance stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, qualification]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  return {
    stats,
    weakAreas,
    isLoading,
    error,
    refresh,
  };
}

/**
 * Hook to fetch daily activities
 * @param userId - The user ID
 * @param dateRange - Date range to fetch
 * @returns Daily activities data
 */
export function useDailyActivities(
  userId: string,
  dateRange: { startDate: string; endDate: string }
): {
  activities: Array<{
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
    studyTime: number;
    mockExamsTaken: number;
  }>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!userId || !dateRange.startDate || !dateRange.endDate) {
      setError('User ID and date range are required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getDailyActivities(userId, dateRange.startDate, dateRange.endDate);
      setActivities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load activities';
      setError(errorMessage);
      console.error('Error loading daily activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const refresh = useCallback(async () => {
    await fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refresh,
  };
}

/**
 * Hook to fetch recent attempts
 * @param userId - The user ID
 * @param qualification - Optional qualification filter
 * @param limit - Maximum number of attempts to return
 * @returns Recent attempts data
 */
export function useRecentAttempts(
  userId: string,
  qualification?: SIAQualification,
  limit = 20
): {
  attempts: QuestionAttempt[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempts = useCallback(async () => {
    if (!userId) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllAttempts(userId, qualification, limit);
      setAttempts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load attempts';
      setError(errorMessage);
      console.error('Error loading attempts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, qualification, limit]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const refresh = useCallback(async () => {
    await fetchAttempts();
  }, [fetchAttempts]);

  return {
    attempts,
    isLoading,
    error,
    refresh,
  };
}
