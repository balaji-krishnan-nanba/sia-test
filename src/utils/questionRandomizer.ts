/**
 * Question Randomizer - Shuffle and generate quiz/exam questions
 */

import type { Question, DifficultyLevel } from '@/types/question';
import { loadExamQuestions, filterQuestions } from '@/lib/questionLoader';
import { seededShuffle } from '@/utils/seededRandom';

/**
 * Quiz generation options
 */
export interface QuizOptions {
  count: number;
  difficulty?: DifficultyLevel[];
  units?: number[];
  chapters?: string[];
  tags?: string[];
  shuffleAnswers?: boolean;
}

/**
 * Mock exam difficulty distribution
 */
const MOCK_EXAM_DIFFICULTY_DISTRIBUTION = {
  easy: 0.4, // 40%
  medium: 0.4, // 40%
  hard: 0.2, // 20%
};

/**
 * Fisher-Yates shuffle algorithm
 * @param array - Array to shuffle
 * @returns Shuffled array (creates a new array)
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * Shuffle questions array
 * @param questions - Questions to shuffle
 * @returns Shuffled questions (new array)
 */
export function shuffleQuestions(questions: Question[]): Question[] {
  return shuffle(questions);
}

/**
 * Shuffle answer options for a question
 * @param question - Question to shuffle answers for
 * @returns New question with shuffled options
 */
export function shuffleAnswers(question: Question): Question {
  return {
    ...question,
    options: shuffle(question.options),
  };
}

/**
 * Generate a quiz from a set of questions based on options
 * @param questions - Source questions
 * @param options - Quiz generation options
 * @returns Selected questions for the quiz
 */
export function generateQuiz(questions: Question[], options: QuizOptions): Question[] {
  let filteredQuestions = [...questions];

  // Apply difficulty filter
  if (options.difficulty && options.difficulty.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) =>
      options.difficulty!.includes(q.difficulty)
    );
  }

  // Apply unit filter
  if (options.units && options.units.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) => {
      const unitNumber = parseInt(q.unitId.substring(1));
      return options.units!.includes(unitNumber);
    });
  }

  // Apply chapter filter
  if (options.chapters && options.chapters.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) =>
      options.chapters!.includes(q.chapterId)
    );
  }

  // Apply tags filter
  if (options.tags && options.tags.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) => {
      const questionTags = q.tags || [];
      return options.tags!.some((tag) => questionTags.includes(tag));
    });
  }

  // Shuffle questions
  const shuffled = shuffleQuestions(filteredQuestions);

  // Take the requested number
  const selected = shuffled.slice(0, Math.min(options.count, shuffled.length));

  // Optionally shuffle answer options
  if (options.shuffleAnswers) {
    return selected.map(shuffleAnswers);
  }

  return selected;
}

/**
 * Generate a balanced mock exam with proper difficulty and unit distribution
 * @param examSlug - The exam type
 * @param count - Total number of questions
 * @param options - Additional options
 * @returns Promise resolving to selected questions
 */
export async function generateMockExam(
  examSlug: 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection',
  count: number,
  options: {
    shuffleAnswers?: boolean;
    ensureBalancedUnits?: boolean;
    seed?: number; // Optional seed for reproducible question selection
    filterUnits?: number[]; // Optional filter by unit numbers (for exam-paper-specific tests)
  } = {}
): Promise<Question[]> {
  const {
    shuffleAnswers: shouldShuffleAnswers = true,
    ensureBalancedUnits = true,
    seed,
    filterUnits,
  } = options;

  // Create shuffle function based on whether seed is provided
  const shuffleFn = <T>(array: T[]): T[] => {
    return seed !== undefined ? seededShuffle(array, seed) : shuffle(array);
  };

  // Load all questions for the exam
  let allQuestions = await loadExamQuestions(examSlug);

  // Filter by units if specified (for exam-paper-specific tests)
  if (filterUnits && filterUnits.length > 0) {
    allQuestions = allQuestions.filter((q) => {
      const unitNumber = parseInt(q.unitId.substring(1));
      return filterUnits.includes(unitNumber);
    });
  }

  if (allQuestions.length === 0) {
    throw new Error(`No questions found for exam: ${examSlug}`);
  }

  // Calculate target counts for each difficulty level
  const targetCounts = {
    easy: Math.round(count * MOCK_EXAM_DIFFICULTY_DISTRIBUTION.easy),
    medium: Math.round(count * MOCK_EXAM_DIFFICULTY_DISTRIBUTION.medium),
    hard: Math.round(count * MOCK_EXAM_DIFFICULTY_DISTRIBUTION.hard),
  };

  // Adjust to match exact count (due to rounding)
  const diff = count - (targetCounts.easy + targetCounts.medium + targetCounts.hard);
  if (diff !== 0) {
    targetCounts.medium += diff;
  }

  // Group questions by difficulty
  const questionsByDifficulty = {
    easy: allQuestions.filter((q) => q.difficulty === 'easy'),
    medium: allQuestions.filter((q) => q.difficulty === 'medium'),
    hard: allQuestions.filter((q) => q.difficulty === 'hard'),
  };

  // Check if we have enough questions
  Object.entries(questionsByDifficulty).forEach(([difficulty, questions]) => {
    const target = targetCounts[difficulty as DifficultyLevel];
    if (questions.length < target) {
      console.warn(
        `Not enough ${difficulty} questions. Required: ${target}, Available: ${questions.length}`
      );
    }
  });

  const selectedQuestions: Question[] = [];

  // Select questions for each difficulty level
  if (ensureBalancedUnits) {
    // Ensure balanced unit distribution for each difficulty level
    for (const [difficulty, target] of Object.entries(targetCounts)) {
      const availableQuestions = questionsByDifficulty[difficulty as DifficultyLevel];

      // Group by unit
      const questionsByUnit = new Map<string, Question[]>();
      availableQuestions.forEach((q) => {
        if (!questionsByUnit.has(q.unitId)) {
          questionsByUnit.set(q.unitId, []);
        }
        questionsByUnit.get(q.unitId)!.push(q);
      });

      // Shuffle questions within each unit
      questionsByUnit.forEach((questions) => {
        const unitId = questions[0]?.unitId;
        if (unitId) {
          questionsByUnit.set(unitId, shuffleFn(questions));
        }
      });

      // Round-robin selection from units
      const units = Array.from(questionsByUnit.keys()).sort();
      let unitIndex = 0;
      let selected = 0;

      while (selected < target && selectedQuestions.length < count) {
        const currentUnit = units[unitIndex % units.length]!;
        const unitQuestions = questionsByUnit.get(currentUnit)!;

        if (unitQuestions.length > 0) {
          const question = unitQuestions.shift()!;
          selectedQuestions.push(question);
          selected++;
        }

        unitIndex++;

        // Break if all units are exhausted
        if (Array.from(questionsByUnit.values()).every((q) => q.length === 0)) {
          break;
        }
      }
    }
  } else {
    // Simple selection without unit balancing
    for (const [difficulty, target] of Object.entries(targetCounts)) {
      const availableQuestions = shuffleFn(questionsByDifficulty[difficulty as DifficultyLevel]);
      const toSelect = Math.min(target, availableQuestions.length);
      selectedQuestions.push(...availableQuestions.slice(0, toSelect));
    }
  }

  // Shuffle the final question order
  let finalQuestions = shuffleFn(selectedQuestions);

  // Optionally shuffle answer options
  if (shouldShuffleAnswers) {
    if (seed !== undefined) {
      // Use seeded shuffle for answer options
      finalQuestions = finalQuestions.map((q, idx) => ({
        ...q,
        options: seededShuffle(q.options, seed + 1000 + idx),
      }));
    } else {
      finalQuestions = finalQuestions.map(shuffleAnswers);
    }
  }

  return finalQuestions;
}

/**
 * Generate a practice quiz from specific chapters
 * @param examSlug - The exam type
 * @param units - Unit numbers to include
 * @param chapters - Chapter IDs to include
 * @param count - Number of questions
 * @param shuffleAnswers - Whether to shuffle answer options
 * @returns Promise resolving to selected questions
 */
export async function generateChapterQuiz(
  examSlug: 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection',
  units: number[],
  chapters: string[],
  count: number,
  shouldShuffleAnswers = false
): Promise<Question[]> {
  const filteredQuestions = await filterQuestions(examSlug, {
    units,
    chapters,
  });

  if (filteredQuestions.length === 0) {
    throw new Error('No questions found for the specified chapters');
  }

  const shuffled = shuffleQuestions(filteredQuestions);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  if (shouldShuffleAnswers) {
    return selected.map((q) => shuffleAnswers(q));
  }

  return selected;
}

/**
 * Generate a difficulty-focused quiz
 * @param examSlug - The exam type
 * @param difficulty - Target difficulty levels
 * @param count - Number of questions
 * @param shouldShuffleAnswers - Whether to shuffle answer options
 * @returns Promise resolving to selected questions
 */
export async function generateDifficultyQuiz(
  examSlug: 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection',
  difficulty: DifficultyLevel[],
  count: number,
  shouldShuffleAnswers = false
): Promise<Question[]> {
  const filteredQuestions = await filterQuestions(examSlug, {
    difficulty,
  });

  if (filteredQuestions.length === 0) {
    throw new Error('No questions found for the specified difficulty levels');
  }

  const shuffled = shuffleQuestions(filteredQuestions);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  if (shouldShuffleAnswers) {
    return selected.map((q) => shuffleAnswers(q));
  }

  return selected;
}

/**
 * Get questions statistics
 * @param questions - Questions to analyze
 * @returns Statistics about the question set
 */
export function getQuestionStats(questions: Question[]): {
  total: number;
  byDifficulty: Record<DifficultyLevel, number>;
  byUnit: Record<string, number>;
  byChapter: Record<string, number>;
} {
  const stats = {
    total: questions.length,
    byDifficulty: { easy: 0, medium: 0, hard: 0 } as Record<DifficultyLevel, number>,
    byUnit: {} as Record<string, number>,
    byChapter: {} as Record<string, number>,
  };

  questions.forEach((q) => {
    // Count by difficulty
    stats.byDifficulty[q.difficulty]++;

    // Count by unit
    if (!stats.byUnit[q.unitId]) {
      stats.byUnit[q.unitId] = 0;
    }
    stats.byUnit[q.unitId]!++;

    // Count by chapter
    if (!stats.byChapter[q.chapterId]) {
      stats.byChapter[q.chapterId] = 0;
    }
    stats.byChapter[q.chapterId]!++;
  });

  return stats;
}
