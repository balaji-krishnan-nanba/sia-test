/**
 * useQuestions Hook - Load and manage questions for an exam
 */

import { useState, useEffect, useCallback } from 'react';
import type { Question, DifficultyLevel } from '@/types/question';
import { loadExamQuestions, filterQuestions } from '@/lib/questionLoader';
import type { ExamSlug } from '@/utils/constants';

export interface UseQuestionsResult {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filterByDifficulty: (difficulties: DifficultyLevel[]) => Question[];
  filterByUnit: (units: number[]) => Question[];
  filterByChapter: (chapters: string[]) => Question[];
  getQuestionCount: () => number;
}

/**
 * Hook to load and manage questions for a specific exam
 * @param examSlug - The exam slug to load questions for
 * @returns Questions data and utility functions
 *
 * @example
 * const { questions, isLoading, error } = useQuestions('door-supervisor');
 */
export function useQuestions(examSlug: ExamSlug): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    if (!examSlug) {
      setError('Exam slug is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const loadedQuestions = await loadExamQuestions(examSlug);
      setQuestions(loadedQuestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
      setError(errorMessage);
      console.error('Error loading questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [examSlug]);

  // Load questions on mount or when examSlug changes
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Filter by difficulty
  const filterByDifficulty = useCallback(
    (difficulties: DifficultyLevel[]): Question[] => {
      if (!difficulties || difficulties.length === 0) {
        return questions;
      }
      return questions.filter((q) => difficulties.includes(q.difficulty));
    },
    [questions]
  );

  // Filter by unit
  const filterByUnit = useCallback(
    (units: number[]): Question[] => {
      if (!units || units.length === 0) {
        return questions;
      }
      return questions.filter((q) => {
        const unitNumber = parseInt(q.unitId.substring(1));
        return units.includes(unitNumber);
      });
    },
    [questions]
  );

  // Filter by chapter
  const filterByChapter = useCallback(
    (chapters: string[]): Question[] => {
      if (!chapters || chapters.length === 0) {
        return questions;
      }
      return questions.filter((q) => chapters.includes(q.chapterId));
    },
    [questions]
  );

  // Get question count
  const getQuestionCount = useCallback(() => {
    return questions.length;
  }, [questions]);

  // Refetch questions
  const refetch = useCallback(async () => {
    await loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    isLoading,
    error,
    refetch,
    filterByDifficulty,
    filterByUnit,
    filterByChapter,
    getQuestionCount,
  };
}

/**
 * Hook to load filtered questions
 * @param examSlug - The exam slug
 * @param filters - Filter criteria
 * @returns Filtered questions
 */
export function useFilteredQuestions(
  examSlug: ExamSlug,
  filters: {
    units?: number[];
    chapters?: string[];
    difficulty?: DifficultyLevel[];
    tags?: string[];
  }
) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilteredQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filtered = await filterQuestions(examSlug, filters);
        setQuestions(filtered);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to filter questions';
        setError(errorMessage);
        console.error('Error filtering questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilteredQuestions();
  }, [examSlug, JSON.stringify(filters)]);

  return { questions, isLoading, error };
}
