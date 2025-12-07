/**
 * Question Loader - Loads and caches questions from JSON files
 */

import type { Question, DifficultyLevel } from '@/types/question';

/**
 * Raw question format from JSON files
 */
interface RawQuestion {
  id: string;
  exam: string;
  unit: number;
  unitTitle: string;
  chapter: string;
  chapterTitle: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  tags?: string[];
}

/**
 * Exam slug type
 */
type ExamSlug = 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection';

/**
 * Map exam slug to exam code
 */
const EXAM_SLUG_TO_CODE: Record<ExamSlug, string> = {
  'door-supervisor': 'ds',
  'security-guard': 'sg',
  'cctv-operator': 'cctv',
  'close-protection': 'cp',
};

/**
 * In-memory cache for loaded questions
 */
const questionCache = new Map<ExamSlug, Question[]>();

/**
 * Convert raw question to Question type
 * Note: We preserve unitTitle and chapterTitle as additional properties
 * even though they're not in the Question type definition
 */
function convertRawQuestion(raw: RawQuestion): Question {
  return {
    id: raw.id,
    qualification: raw.exam.toUpperCase() as any,
    unitId: `U${raw.unit}`,
    chapterId: raw.chapter,
    questionText: raw.question,
    type: 'multiple-choice',
    options: [
      { id: 'A', text: raw.options.A, isCorrect: raw.correctAnswer === 'A' },
      { id: 'B', text: raw.options.B, isCorrect: raw.correctAnswer === 'B' },
      { id: 'C', text: raw.options.C, isCorrect: raw.correctAnswer === 'C' },
      { id: 'D', text: raw.options.D, isCorrect: raw.correctAnswer === 'D' },
    ],
    explanation: raw.explanation,
    difficulty: raw.difficulty,
    tags: raw.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Preserve additional metadata for UI purposes
    unitTitle: raw.unitTitle,
    chapterTitle: raw.chapterTitle,
  } as Question;
}

/**
 * Load questions for a specific exam from JSON file
 * @param examSlug - The exam slug (e.g., 'door-supervisor')
 * @returns Promise resolving to array of questions
 * @throws Error if file cannot be loaded
 */
export async function loadExamQuestions(examSlug: ExamSlug): Promise<Question[]> {
  // Check cache first
  if (questionCache.has(examSlug)) {
    const cached = questionCache.get(examSlug)!;
    console.log(`[questionLoader] Loaded ${cached.length} questions from cache for ${examSlug}`);
    return cached;
  }

  try {
    const fetchUrl = `${import.meta.env.BASE_URL}data/questions/${examSlug}.json`;
    console.log(`[questionLoader] Fetching questions from: ${fetchUrl}`);

    // Import the JSON file dynamically
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      console.error(`[questionLoader] Fetch failed with status ${response.status}: ${response.statusText}`);
      throw new Error(`Failed to load questions for ${examSlug}: ${response.statusText}`);
    }

    const rawQuestions: RawQuestion[] = await response.json();
    console.log(`[questionLoader] Fetched ${rawQuestions.length} raw questions for ${examSlug}`);

    // Convert to Question type
    const questions = rawQuestions.map(convertRawQuestion);
    console.log(`[questionLoader] Converted ${questions.length} questions successfully`);

    // Cache the results
    questionCache.set(examSlug, questions);

    return questions;
  } catch (error) {
    console.error(`[questionLoader] Error loading questions for ${examSlug}:`, error);
    throw new Error(`Failed to load questions for ${examSlug}. Please try again later.`);
  }
}

/**
 * Load questions for a specific chapter
 * @param examSlug - The exam slug
 * @param unit - The unit number
 * @param chapter - The chapter identifier (e.g., "1.1")
 * @returns Array of questions for the chapter
 */
export async function loadChapterQuestions(
  examSlug: ExamSlug,
  unit: number,
  chapter: string
): Promise<Question[]> {
  const allQuestions = await loadExamQuestions(examSlug);

  return allQuestions.filter(
    (q) => q.unitId === `U${unit}` && q.chapterId === chapter
  );
}

/**
 * Get a specific question by ID
 * @param questionId - The question ID
 * @returns The question or undefined if not found
 */
export async function getQuestionById(questionId: string): Promise<Question | undefined> {
  // Extract exam code from question ID (e.g., "DS-U1-C1_1-001" -> "DS")
  const examCode = questionId.split('-')[0]?.toLowerCase();

  // Find the matching exam slug
  const examSlug = Object.entries(EXAM_SLUG_TO_CODE).find(
    ([_, code]) => code === examCode
  )?.[0] as ExamSlug | undefined;

  if (!examSlug) {
    console.error(`Invalid question ID format: ${questionId}`);
    return undefined;
  }

  try {
    const questions = await loadExamQuestions(examSlug);
    return questions.find((q) => q.id === questionId);
  } catch (error) {
    console.error(`Error getting question ${questionId}:`, error);
    return undefined;
  }
}

/**
 * Filter questions by criteria
 * @param examSlug - The exam slug
 * @param filters - Filter criteria
 * @returns Filtered array of questions
 */
export async function filterQuestions(
  examSlug: ExamSlug,
  filters: {
    units?: number[];
    chapters?: string[];
    difficulty?: DifficultyLevel[];
    tags?: string[];
  }
): Promise<Question[]> {
  const allQuestions = await loadExamQuestions(examSlug);

  return allQuestions.filter((question) => {
    // Filter by units
    if (filters.units && filters.units.length > 0) {
      const unitNumber = parseInt(question.unitId.substring(1));
      if (!filters.units.includes(unitNumber)) {
        return false;
      }
    }

    // Filter by chapters
    if (filters.chapters && filters.chapters.length > 0) {
      if (!filters.chapters.includes(question.chapterId)) {
        return false;
      }
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
      if (!filters.difficulty.includes(question.difficulty)) {
        return false;
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      const questionTags = question.tags || [];
      if (!filters.tags.some((tag) => questionTags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Clear the question cache
 * Useful for testing or when questions are updated
 */
export function clearQuestionCache(): void {
  questionCache.clear();
}

/**
 * Get all available exam slugs
 */
export function getAvailableExams(): ExamSlug[] {
  return Object.keys(EXAM_SLUG_TO_CODE) as ExamSlug[];
}

/**
 * Get exam code from slug
 */
export function getExamCode(examSlug: ExamSlug): string {
  return EXAM_SLUG_TO_CODE[examSlug];
}
