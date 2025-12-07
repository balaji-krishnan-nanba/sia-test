/**
 * Question and Exam related types for SIA Exam Preparation
 */

/**
 * SIA Qualification types
 */
export type SIAQualification = 'DS' | 'CP' | 'CCTV' | 'SG';

export const SIA_QUALIFICATION_NAMES: Record<SIAQualification, string> = {
  DS: 'Door Supervisor',
  CP: 'Close Protection',
  CCTV: 'CCTV Operator',
  SG: 'Security Guard',
};

/**
 * Difficulty levels for questions
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Question type
 */
export type QuestionType = 'multiple-choice' | 'true-false';

/**
 * Single answer option for a multiple choice question
 */
export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Core Question interface
 */
export interface Question {
  id: string;
  qualification: SIAQualification;
  unitId: string;
  chapterId: string;
  questionText: string;
  type: QuestionType;
  options: AnswerOption[];
  explanation?: string;
  difficulty: DifficultyLevel;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Chapter within a unit
 */
export interface Chapter {
  id: string;
  unitId: string;
  chapterNumber: number;
  title: string;
  description?: string;
  questionCount: number;
}

/**
 * Unit within a qualification
 */
export interface Unit {
  id: string;
  qualification: SIAQualification;
  unitNumber: number;
  title: string;
  description?: string;
  chapters: Chapter[];
  totalQuestions: number;
}

/**
 * Exam configuration
 */
export interface ExamConfig {
  id: string;
  qualification: SIAQualification;
  totalQuestions: number;
  passingScore: number; // percentage
  timeLimit: number; // in minutes
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

/**
 * Question with user's answer (used during quiz/exam)
 */
export interface QuestionWithAnswer extends Question {
  userAnswer?: string | null;
  isCorrect?: boolean;
  timeSpent?: number; // in seconds
  flaggedForReview?: boolean;
}

/**
 * Quiz/Practice session
 */
export interface QuizSession {
  id: string;
  userId: string;
  qualification: SIAQualification;
  unitId?: string;
  chapterId?: string;
  questions: QuestionWithAnswer[];
  startedAt: string;
  completedAt?: string;
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
}

/**
 * Mock exam attempt
 */
export interface MockExamAttempt {
  id: string;
  userId: string;
  examConfigId: string;
  qualification: SIAQualification;
  questions: QuestionWithAnswer[];
  startedAt: string;
  completedAt?: string;
  score?: number;
  passingScore: number;
  passed?: boolean;
  timeSpent: number; // in seconds
  totalTimeLimit: number; // in seconds
}

/**
 * Question filter options
 */
export interface QuestionFilters {
  qualification?: SIAQualification;
  unitId?: string;
  chapterId?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}
