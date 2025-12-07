/**
 * User progress and statistics types
 */

import type { SIAQualification, DifficultyLevel } from './question';

/**
 * Progress for a specific chapter
 */
export interface ChapterProgress {
  chapterId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  lastStudiedAt?: string;
}

/**
 * Progress for a specific unit
 */
export interface UnitProgress {
  unitId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  chapters: ChapterProgress[];
  lastStudiedAt?: string;
  isCompleted: boolean;
}

/**
 * Overall progress for a qualification
 */
export interface QualificationProgress {
  qualification: SIAQualification;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  units: UnitProgress[];
  mockExamsTaken: number;
  bestMockExamScore?: number;
  lastMockExamScore?: number;
  estimatedReadiness: number; // percentage (0-100)
  lastStudiedAt?: string;
}

/**
 * User's overall learning progress
 */
export interface UserProgress {
  userId: string;
  qualifications: QualificationProgress[];
  totalStudyTime: number; // in minutes
  currentStreak: number; // days
  longestStreak: number; // days
  lastStudyDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Daily study activity
 */
export interface DailyActivity {
  date: string; // YYYY-MM-DD
  questionsAnswered: number;
  correctAnswers: number;
  studyTime: number; // in minutes
  mockExamsTaken: number;
}

/**
 * Study streak information
 */
export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  streakStartDate?: string;
}

/**
 * Performance by difficulty
 */
export interface PerformanceByDifficulty {
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
  qualification: SIAQualification;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  overallAccuracy: number; // percentage
  byDifficulty: PerformanceByDifficulty[];
  averageTimePerQuestion: number; // in seconds
  strongChapters: string[]; // chapter IDs with >80% accuracy
  weakChapters: string[]; // chapter IDs with <60% accuracy
}

/**
 * Mock exam result summary
 */
export interface MockExamResult {
  attemptId: string;
  qualification: SIAQualification;
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeSpent: number; // in seconds
  completedAt: string;
}

/**
 * Learning insights and recommendations
 */
export interface LearningInsights {
  userId: string;
  qualification: SIAQualification;
  readinessScore: number; // 0-100
  recommendedStudyTime: number; // minutes per day
  focusAreas: {
    unitId: string;
    chapterId: string;
    reason: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  nextMilestone: {
    description: string;
    progress: number; // percentage
  };
  generatedAt: string;
}
