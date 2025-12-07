/**
 * Answer Scorer - Check answers and calculate performance statistics
 */

import type { DifficultyLevel } from '@/types/question';

/**
 * Question attempt record
 */
export interface QuestionAttempt {
  questionId: string;
  unitId: string;
  chapterId: string;
  difficulty: DifficultyLevel;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  attemptedAt: string;
}

/**
 * Unit performance breakdown
 */
export interface UnitBreakdown {
  unitId: string;
  totalAttempts: number;
  correctAnswers: number;
  accuracy: number; // percentage
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // percentage
  averageTimePerQuestion: number; // in seconds
  byDifficulty: {
    easy: { total: number; correct: number; accuracy: number };
    medium: { total: number; correct: number; accuracy: number };
    hard: { total: number; correct: number; accuracy: number };
  };
  byUnit: Record<string, { total: number; correct: number; accuracy: number }>;
}

/**
 * Weak area identification
 */
export interface WeakArea {
  type: 'unit' | 'chapter' | 'difficulty';
  identifier: string;
  label: string;
  accuracy: number;
  totalAttempts: number;
  recommendation: string;
}

/**
 * Check if a user's answer is correct
 * @param questionId - The question ID (for logging)
 * @param userAnswer - The user's answer
 * @param correctAnswer - The correct answer
 * @returns True if the answer is correct
 */
export function checkAnswer(
  questionId: string,
  userAnswer: string,
  correctAnswer: string
): boolean {
  if (!userAnswer || !correctAnswer) {
    console.warn(`Invalid answer check for question ${questionId}`);
    return false;
  }

  // Normalize answers (trim and compare case-insensitively for answer IDs)
  const normalizedUserAnswer = userAnswer.trim().toUpperCase();
  const normalizedCorrectAnswer = correctAnswer.trim().toUpperCase();

  return normalizedUserAnswer === normalizedCorrectAnswer;
}

/**
 * Calculate overall accuracy from attempts
 * @param attempts - Array of question attempts
 * @returns Accuracy as a percentage (0-100)
 */
export function calculateAccuracy(attempts: QuestionAttempt[]): number {
  if (attempts.length === 0) {
    return 0;
  }

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  return Math.round((correctCount / attempts.length) * 100 * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate unit-by-unit breakdown
 * @param attempts - Array of question attempts
 * @returns Array of unit breakdowns
 */
export function calculateUnitBreakdown(attempts: QuestionAttempt[]): UnitBreakdown[] {
  const unitMap = new Map<string, { total: number; correct: number }>();

  attempts.forEach((attempt) => {
    const existing = unitMap.get(attempt.unitId) || { total: 0, correct: 0 };
    existing.total++;
    if (attempt.isCorrect) {
      existing.correct++;
    }
    unitMap.set(attempt.unitId, existing);
  });

  const breakdowns: UnitBreakdown[] = [];
  unitMap.forEach((stats, unitId) => {
    breakdowns.push({
      unitId,
      totalAttempts: stats.total,
      correctAnswers: stats.correct,
      accuracy: Math.round((stats.correct / stats.total) * 100 * 100) / 100,
    });
  });

  // Sort by unit ID
  return breakdowns.sort((a, b) => a.unitId.localeCompare(b.unitId));
}

/**
 * Calculate comprehensive performance statistics
 * @param attempts - Array of question attempts
 * @returns Detailed performance statistics
 */
export function getPerformanceStats(attempts: QuestionAttempt[]): PerformanceStats {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0,
      averageTimePerQuestion: 0,
      byDifficulty: {
        easy: { total: 0, correct: 0, accuracy: 0 },
        medium: { total: 0, correct: 0, accuracy: 0 },
        hard: { total: 0, correct: 0, accuracy: 0 },
      },
      byUnit: {},
    };
  }

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const totalTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0);

  // Calculate by difficulty
  const difficultyStats = {
    easy: { total: 0, correct: 0, accuracy: 0 },
    medium: { total: 0, correct: 0, accuracy: 0 },
    hard: { total: 0, correct: 0, accuracy: 0 },
  };

  attempts.forEach((attempt) => {
    difficultyStats[attempt.difficulty].total++;
    if (attempt.isCorrect) {
      difficultyStats[attempt.difficulty].correct++;
    }
  });

  // Calculate accuracy for each difficulty
  Object.keys(difficultyStats).forEach((key) => {
    const difficulty = key as DifficultyLevel;
    const stats = difficultyStats[difficulty];
    if (stats.total > 0) {
      stats.accuracy = Math.round((stats.correct / stats.total) * 100 * 100) / 100;
    }
  });

  // Calculate by unit
  const unitStats: Record<string, { total: number; correct: number; accuracy: number }> = {};
  attempts.forEach((attempt) => {
    if (!unitStats[attempt.unitId]) {
      unitStats[attempt.unitId] = { total: 0, correct: 0, accuracy: 0 };
    }
    unitStats[attempt.unitId]!.total++;
    if (attempt.isCorrect) {
      unitStats[attempt.unitId]!.correct++;
    }
  });

  // Calculate accuracy for each unit
  Object.keys(unitStats).forEach((unitId) => {
    const stats = unitStats[unitId];
    if (stats && stats.total > 0) {
      stats.accuracy = Math.round((stats.correct / stats.total) * 100 * 100) / 100;
    }
  });

  return {
    totalAttempts: attempts.length,
    correctCount,
    incorrectCount: attempts.length - correctCount,
    accuracy: Math.round((correctCount / attempts.length) * 100 * 100) / 100,
    averageTimePerQuestion: Math.round((totalTime / attempts.length) * 100) / 100,
    byDifficulty: difficultyStats,
    byUnit: unitStats,
  };
}

/**
 * Identify weak areas that need more practice
 * @param attempts - Array of question attempts
 * @param weakThreshold - Accuracy threshold to consider as weak (default 60%)
 * @returns Array of weak areas with recommendations
 */
export function identifyWeakAreas(
  attempts: QuestionAttempt[],
  weakThreshold = 60
): WeakArea[] {
  if (attempts.length === 0) {
    return [];
  }

  const weakAreas: WeakArea[] = [];

  // Check difficulty levels
  const difficultyStats = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  };

  attempts.forEach((attempt) => {
    difficultyStats[attempt.difficulty].total++;
    if (attempt.isCorrect) {
      difficultyStats[attempt.difficulty].correct++;
    }
  });

  Object.entries(difficultyStats).forEach(([difficulty, stats]) => {
    if (stats.total >= 5) {
      // Only consider if at least 5 attempts
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy < weakThreshold) {
        weakAreas.push({
          type: 'difficulty',
          identifier: difficulty,
          label: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} questions`,
          accuracy: Math.round(accuracy * 100) / 100,
          totalAttempts: stats.total,
          recommendation: `Focus on practicing more ${difficulty} difficulty questions to improve your understanding.`,
        });
      }
    }
  });

  // Check units
  const unitStats = new Map<string, { total: number; correct: number }>();
  attempts.forEach((attempt) => {
    const existing = unitStats.get(attempt.unitId) || { total: 0, correct: 0 };
    existing.total++;
    if (attempt.isCorrect) {
      existing.correct++;
    }
    unitStats.set(attempt.unitId, existing);
  });

  unitStats.forEach((stats, unitId) => {
    if (stats.total >= 5) {
      // Only consider if at least 5 attempts
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy < weakThreshold) {
        weakAreas.push({
          type: 'unit',
          identifier: unitId,
          label: `Unit ${unitId.substring(1)}`,
          accuracy: Math.round(accuracy * 100) / 100,
          totalAttempts: stats.total,
          recommendation: `Review the material for Unit ${unitId.substring(1)} and practice more questions from this unit.`,
        });
      }
    }
  });

  // Check chapters
  const chapterStats = new Map<string, { total: number; correct: number }>();
  attempts.forEach((attempt) => {
    const existing = chapterStats.get(attempt.chapterId) || { total: 0, correct: 0 };
    existing.total++;
    if (attempt.isCorrect) {
      existing.correct++;
    }
    chapterStats.set(attempt.chapterId, existing);
  });

  chapterStats.forEach((stats, chapterId) => {
    if (stats.total >= 3) {
      // Only consider if at least 3 attempts
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy < weakThreshold) {
        weakAreas.push({
          type: 'chapter',
          identifier: chapterId,
          label: `Chapter ${chapterId}`,
          accuracy: Math.round(accuracy * 100) / 100,
          totalAttempts: stats.total,
          recommendation: `Study Chapter ${chapterId} material more thoroughly and practice questions from this chapter.`,
        });
      }
    }
  });

  // Sort by accuracy (weakest first)
  return weakAreas.sort((a, b) => a.accuracy - b.accuracy);
}

/**
 * Calculate streak of correct answers
 * @param attempts - Array of question attempts (should be sorted by attemptedAt)
 * @returns Current streak of correct answers
 */
export function calculateCorrectStreak(attempts: QuestionAttempt[]): number {
  if (attempts.length === 0) {
    return 0;
  }

  // Sort by attemptedAt (most recent first)
  const sorted = [...attempts].sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
  );

  let streak = 0;
  for (const attempt of sorted) {
    if (attempt.isCorrect) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate the pass rate for a set of attempts
 * @param attempts - Array of question attempts
 * @param passingThreshold - Passing percentage (default 70%)
 * @returns Whether the user would pass based on these attempts
 */
export function calculatePassRate(
  attempts: QuestionAttempt[],
  passingThreshold = 70
): { passed: boolean; accuracy: number; threshold: number } {
  const accuracy = calculateAccuracy(attempts);

  return {
    passed: accuracy >= passingThreshold,
    accuracy,
    threshold: passingThreshold,
  };
}

/**
 * Get recent performance trend
 * @param attempts - Array of question attempts (should be sorted by attemptedAt)
 * @param recentCount - Number of recent attempts to consider (default 10)
 * @returns Comparison between recent and overall performance
 */
export function getPerformanceTrend(
  attempts: QuestionAttempt[],
  recentCount = 10
): {
  recentAccuracy: number;
  overallAccuracy: number;
  trend: 'improving' | 'declining' | 'stable';
  trendPercentage: number;
} {
  if (attempts.length === 0) {
    return {
      recentAccuracy: 0,
      overallAccuracy: 0,
      trend: 'stable',
      trendPercentage: 0,
    };
  }

  // Sort by attemptedAt (most recent first)
  const sorted = [...attempts].sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
  );

  const overallAccuracy = calculateAccuracy(attempts);
  const recentAttempts = sorted.slice(0, Math.min(recentCount, sorted.length));
  const recentAccuracy = calculateAccuracy(recentAttempts);

  const difference = recentAccuracy - overallAccuracy;
  const trendPercentage = Math.round(Math.abs(difference) * 100) / 100;

  let trend: 'improving' | 'declining' | 'stable';
  if (Math.abs(difference) < 5) {
    // Within 5% considered stable
    trend = 'stable';
  } else if (difference > 0) {
    trend = 'improving';
  } else {
    trend = 'declining';
  }

  return {
    recentAccuracy: Math.round(recentAccuracy * 100) / 100,
    overallAccuracy: Math.round(overallAccuracy * 100) / 100,
    trend,
    trendPercentage,
  };
}
