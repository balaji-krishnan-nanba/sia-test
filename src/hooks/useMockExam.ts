/**
 * useMockExam Hook - Manage mock exam state with timer
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Question } from '@/types/question';
import { generateMockExam } from '@/utils/questionRandomizer';
import { useQuizSession } from './useQuizSession';
import { saveMockExamResult } from '@/utils/progressTracker';
import { ExamSlug, EXAM_DETAILS, TIMING } from '@/utils/constants';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';

export interface MockExamResult {
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeSpent: number;
  completedAt: string;
}

export interface UseMockExamResult {
  // Quiz session props
  currentQuestion: any;
  currentIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  answeredCount: number;
  flaggedCount: number;
  progress: number;
  selectAnswer: (answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleFlag: () => void;
  isQuestionAnswered: (index: number) => boolean;
  getQuestionAtIndex: (index: number) => any;

  // Timer props
  timeRemaining: number; // in seconds
  timeElapsed: number; // in seconds
  timeLimit: number; // in seconds
  isTimeUp: boolean;
  formattedTimeRemaining: string;

  // Mock exam specific
  isLoading: boolean;
  isSubmitting: boolean;
  isCompleted: boolean;
  result: MockExamResult | null;
  submitExam: () => Promise<void>;
  startNewExam: () => void;
}

/**
 * Hook to manage mock exam with timer
 * @param examSlug - The exam type
 * @param userId - The user ID (optional, for saving results)
 * @returns Mock exam state and controls
 *
 * @example
 * const exam = useMockExam('door-supervisor', userId);
 */
export function useMockExam(examSlug: ExamSlug, userId?: string): UseMockExamResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<MockExamResult | null>(null);

  // Get exam details
  const examDetails = EXAM_DETAILS[examSlug];
  const timeLimit = TIMING.MOCK_EXAM_DURATION[examSlug];

  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, _setIsPaused] = useState(false);

  // Storage for timer state
  const storageKey = `${STORAGE_KEYS.MOCK_EXAM_STATE}_${examSlug}_timer`;
  const [timerState, setTimerState] = useLocalStorage<{
    startTime: number;
    elapsed: number;
  } | null>(storageKey, null);

  // Initialize quiz session
  const quizSession = useQuizSession(questions, {
    saveProgress: true,
    autoSave: true,
    sessionKey: `mock_exam_${examSlug}`,
  });

  const { isCompleted: quizCompleted } = quizSession;

  // Load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const mockQuestions = await generateMockExam(examSlug, examDetails.totalQuestions, {
          shuffleAnswers: true,
          ensureBalancedUnits: true,
        });
        setQuestions(mockQuestions);

        // Initialize timer if not already started
        if (!timerState) {
          setTimerState({
            startTime: Date.now(),
            elapsed: 0,
          });
        } else {
          setTimeElapsed(timerState.elapsed);
        }
      } catch (error) {
        console.error('Error loading mock exam:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [examSlug]);

  // Timer effect
  useEffect(() => {
    if (isLoading || quizCompleted || isPaused || !timerState) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000) + timerState.elapsed;
      setTimeElapsed(elapsed);

      // Auto-submit when time is up
      if (elapsed >= timeLimit) {
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, quizCompleted, isPaused, timerState, timeLimit]);

  // Calculate time remaining
  const timeRemaining = useMemo(() => {
    return Math.max(0, timeLimit - timeElapsed);
  }, [timeLimit, timeElapsed]);

  const isTimeUp = timeRemaining === 0;

  // Format time remaining as MM:SS
  const formattedTimeRemaining = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  // Submit exam
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Submit quiz session
      quizSession.submitQuiz();

      // Calculate results
      const totalQuestions = quizSession.totalQuestions;
      const correctAnswers = quizSession.correctCount;
      const incorrectAnswers = quizSession.answeredCount - correctAnswers;
      const unanswered = totalQuestions - quizSession.answeredCount;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= examDetails.passingScore;

      const examResult: MockExamResult = {
        score,
        passingScore: examDetails.passingScore,
        passed,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        unanswered,
        timeSpent: timeElapsed,
        completedAt: new Date().toISOString(),
      };

      setResult(examResult);

      // Save to database if userId is provided
      if (userId) {
        await saveMockExamResult(userId, {
          qualification: examDetails.code,
          score,
          passingScore: examDetails.passingScore,
          totalQuestions,
          correctAnswers,
          timeSpent: timeElapsed,
          questions: questions.map((q, index) => {
            const quizQ = quizSession.getQuestionAtIndex(index);
            return {
              questionId: q.id,
              userAnswer: quizQ?.userAnswer || null,
              isCorrect: quizQ?.isCorrect || false,
            };
          }),
        });
      }

      // Clear timer state
      setTimerState(null);
    } catch (error) {
      console.error('Error submitting mock exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    quizSession,
    examDetails,
    timeElapsed,
    userId,
    questions,
    setTimerState,
  ]);

  // Start new exam
  const startNewExam = useCallback(() => {
    // Reset quiz session
    quizSession.resetQuiz();

    // Reset timer
    setTimeElapsed(0);
    setTimerState({
      startTime: Date.now(),
      elapsed: 0,
    });

    // Reset result
    setResult(null);

    // Reload questions
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const mockQuestions = await generateMockExam(examSlug, examDetails.totalQuestions, {
          shuffleAnswers: true,
          ensureBalancedUnits: true,
        });
        setQuestions(mockQuestions);
      } catch (error) {
        console.error('Error loading mock exam:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [quizSession, examSlug, examDetails, setTimerState]);

  return {
    // Quiz session
    ...quizSession,

    // Timer
    timeRemaining,
    timeElapsed,
    timeLimit,
    isTimeUp,
    formattedTimeRemaining,

    // Mock exam specific
    isLoading,
    isSubmitting,
    isCompleted: quizCompleted,
    result,
    submitExam: handleSubmit,
    startNewExam,
  };
}
