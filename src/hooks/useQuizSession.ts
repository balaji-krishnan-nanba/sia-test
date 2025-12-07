/**
 * useQuizSession Hook - Manage quiz session state
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Question } from '@/types/question';
import { checkAnswer } from '@/utils/scorer';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';

export interface QuizQuestion extends Question {
  userAnswer?: string | null;
  isCorrect?: boolean;
  timeSpent?: number;
  flaggedForReview?: boolean;
}

export interface QuizSessionState {
  questions: QuizQuestion[];
  currentIndex: number;
  startedAt: string;
  completedAt?: string;
}

export interface UseQuizSessionResult {
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isCompleted: boolean;
  answeredCount: number;
  correctCount: number;
  flaggedCount: number;
  progress: number; // percentage
  selectAnswer: (answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleFlag: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  getQuestionAtIndex: (index: number) => QuizQuestion | null;
  isQuestionAnswered: (index: number) => boolean;
}

/**
 * Hook to manage quiz session state and navigation
 * @param questions - Array of questions for the quiz
 * @param options - Quiz options
 * @returns Quiz session state and control functions
 *
 * @example
 * const quiz = useQuizSession(questions, { saveProgress: true });
 */
export function useQuizSession(
  questions: Question[],
  options: {
    saveProgress?: boolean;
    autoSave?: boolean;
    sessionKey?: string;
  } = {}
): UseQuizSessionResult {
  const { saveProgress = true, autoSave = true, sessionKey = 'default' } = options;

  const storageKey = `${STORAGE_KEYS.QUIZ_STATE}_${sessionKey}`;

  // Initialize quiz state
  const [quizState, setQuizState, clearQuizState] = useLocalStorage<QuizSessionState | null>(
    storageKey,
    null
  );

  // Initialize questions with user answer fields
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    if (quizState && quizState.questions.length === questions.length) {
      return quizState.questions;
    }
    return questions.map((q) => ({
      ...q,
      userAnswer: null,
      isCorrect: undefined,
      timeSpent: 0,
      flaggedForReview: false,
    }));
  });

  const [currentIndex, setCurrentIndex] = useState<number>(quizState?.currentIndex || 0);
  const [startedAt] = useState<string>(quizState?.startedAt || new Date().toISOString());
  const [completedAt, setCompletedAt] = useState<string | undefined>(quizState?.completedAt);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Update quiz questions when the questions prop changes (e.g., after async loading)
  useEffect(() => {
    if (questions.length > 0 && quizQuestions.length === 0) {
      console.log(`[useQuizSession] Questions loaded: ${questions.length} questions`);
      setQuizQuestions(
        questions.map((q) => ({
          ...q,
          userAnswer: null,
          isCorrect: undefined,
          timeSpent: 0,
          flaggedForReview: false,
        }))
      );
      setCurrentIndex(0);
    } else if (questions.length > 0 && questions.length !== quizQuestions.length) {
      // Questions changed (different count), reset the quiz
      console.log(`[useQuizSession] Questions changed: ${questions.length} questions`);
      setQuizQuestions(
        questions.map((q) => ({
          ...q,
          userAnswer: null,
          isCorrect: undefined,
          timeSpent: 0,
          flaggedForReview: false,
        }))
      );
      setCurrentIndex(0);
      setCompletedAt(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  // Save state to localStorage
  useEffect(() => {
    if (saveProgress && autoSave) {
      setQuizState({
        questions: quizQuestions,
        currentIndex,
        startedAt,
        completedAt,
      });
    }
  }, [quizQuestions, currentIndex, startedAt, completedAt, saveProgress, autoSave, setQuizState]);

  // Track time spent on current question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  // Update time spent when changing questions
  const updateTimeSpent = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setQuizQuestions((prev) => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          timeSpent: (updated[currentIndex].timeSpent || 0) + timeSpent,
        };
      }
      return updated;
    });
  }, [currentIndex, questionStartTime]);

  // Current question
  const currentQuestion = useMemo(() => {
    return quizQuestions[currentIndex] || null;
  }, [quizQuestions, currentIndex]);

  // Computed values
  const totalQuestions = quizQuestions.length;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isCompleted = !!completedAt;

  const answeredCount = useMemo(() => {
    return quizQuestions.filter((q) => q.userAnswer !== null && q.userAnswer !== undefined).length;
  }, [quizQuestions]);

  const correctCount = useMemo(() => {
    return quizQuestions.filter((q) => q.isCorrect === true).length;
  }, [quizQuestions]);

  const flaggedCount = useMemo(() => {
    return quizQuestions.filter((q) => q.flaggedForReview === true).length;
  }, [quizQuestions]);

  const progress = useMemo(() => {
    return totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  }, [answeredCount, totalQuestions]);

  // Select an answer
  const selectAnswer = useCallback(
    (answerId: string) => {
      if (isCompleted) return;

      const question = quizQuestions[currentIndex];
      if (!question) return;

      const correctAnswer = question.options.find((opt) => opt.isCorrect)?.id || '';
      const isCorrect = checkAnswer(question.id, answerId, correctAnswer);

      setQuizQuestions((prev) => {
        const updated = [...prev];
        if (updated[currentIndex]) {
          updated[currentIndex] = {
            ...updated[currentIndex],
            userAnswer: answerId,
            isCorrect,
          };
        }
        return updated;
      });
    },
    [currentIndex, quizQuestions, isCompleted]
  );

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    updateTimeSpent();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions, updateTimeSpent]);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    updateTimeSpent();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, updateTimeSpent]);

  // Go to specific question
  const goToQuestion = useCallback(
    (index: number) => {
      updateTimeSpent();
      if (index >= 0 && index < totalQuestions) {
        setCurrentIndex(index);
      }
    },
    [totalQuestions, updateTimeSpent]
  );

  // Toggle flag for review
  const toggleFlag = useCallback(() => {
    if (isCompleted) return;

    setQuizQuestions((prev) => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          flaggedForReview: !updated[currentIndex].flaggedForReview,
        };
      }
      return updated;
    });
  }, [currentIndex, isCompleted]);

  // Submit quiz
  const submitQuiz = useCallback(() => {
    updateTimeSpent();
    setCompletedAt(new Date().toISOString());
  }, [updateTimeSpent]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setQuizQuestions(
      questions.map((q) => ({
        ...q,
        userAnswer: null,
        isCorrect: undefined,
        timeSpent: 0,
        flaggedForReview: false,
      }))
    );
    setCurrentIndex(0);
    setCompletedAt(undefined);
    clearQuizState();
  }, [questions, clearQuizState]);

  // Get question at specific index
  const getQuestionAtIndex = useCallback(
    (index: number): QuizQuestion | null => {
      return quizQuestions[index] || null;
    },
    [quizQuestions]
  );

  // Check if question is answered
  const isQuestionAnswered = useCallback(
    (index: number): boolean => {
      const question = quizQuestions[index];
      return question ? question.userAnswer !== null && question.userAnswer !== undefined : false;
    },
    [quizQuestions]
  );

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    isCompleted,
    answeredCount,
    correctCount,
    flaggedCount,
    progress,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    toggleFlag,
    submitQuiz,
    resetQuiz,
    getQuestionAtIndex,
    isQuestionAnswered,
  };
}
