/**
 * Practice Page - Unit and Chapter Selection for Targeted Practice
 * URL: /exam/:examSlug/practice
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadExamQuestions } from '@/lib/questionLoader';
import { EXAM_DETAILS, type ExamSlug } from '@/utils/constants';
import type { Question } from '@/types/question';
import { Button, Card, Spinner } from '@/components/ui';

/**
 * Unit information with chapters
 */
interface UnitWithChapters {
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  questionCount: number;
  chapters: ChapterInfo[];
}

/**
 * Chapter information with progress
 */
interface ChapterInfo {
  chapterId: string;
  chapterTitle: string;
  questionCount: number;
  progress: ProgressInfo;
}

/**
 * Progress information from localStorage
 */
interface ProgressInfo {
  attempted: number;
  correct: number;
  percentage: number;
}

/**
 * Get practice progress from localStorage
 */
function getPracticeProgress(examSlug: string, unitId: string, chapterId: string): ProgressInfo {
  try {
    const key = `practice-progress-${examSlug}-${unitId}-${chapterId}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      return { attempted: 0, correct: 0, percentage: 0 };
    }

    const data = JSON.parse(stored);
    const percentage = data.total > 0 ? Math.round((data.attempted / data.total) * 100) : 0;

    return {
      attempted: data.attempted || 0,
      correct: data.correct || 0,
      percentage,
    };
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
    return { attempted: 0, correct: 0, percentage: 0 };
  }
}

/**
 * Extract units with chapters from questions
 */
function extractUnitsWithChapters(
  questions: Question[],
  examSlug: string
): UnitWithChapters[] {
  const unitMap = new Map<string, UnitWithChapters>();

  questions.forEach((q) => {
    // Get or create unit
    if (!unitMap.has(q.unitId)) {
      const unitNumber = parseInt(q.unitId.substring(1));

      // Find the first question's raw data to get unitTitle
      // We need to look at the raw question data structure
      // Since Question type doesn't have unitTitle, we'll need to fetch from raw data
      const unitTitle = (q as any).unitTitle || `Unit ${unitNumber}`;

      unitMap.set(q.unitId, {
        unitId: q.unitId,
        unitNumber,
        unitTitle,
        questionCount: 0,
        chapters: [],
      });
    }

    const unit = unitMap.get(q.unitId)!;
    unit.questionCount++;

    // Get or create chapter
    let chapter = unit.chapters.find((ch) => ch.chapterId === q.chapterId);

    if (!chapter) {
      const chapterTitle = (q as any).chapterTitle || `Chapter ${q.chapterId}`;

      chapter = {
        chapterId: q.chapterId,
        chapterTitle,
        questionCount: 0,
        progress: getPracticeProgress(examSlug, q.unitId, q.chapterId),
      };

      unit.chapters.push(chapter);
    }

    chapter.questionCount++;
  });

  // Sort units by number and chapters within each unit
  const units = Array.from(unitMap.values()).sort((a, b) => a.unitNumber - b.unitNumber);

  units.forEach((unit) => {
    unit.chapters.sort((a, b) =>
      a.chapterId.localeCompare(b.chapterId, undefined, { numeric: true })
    );
  });

  return units;
}

export function PracticePage() {
  const { examSlug } = useParams<{ examSlug: ExamSlug }>();
  const navigate = useNavigate();

  const [units, setUnits] = useState<UnitWithChapters[]>([]);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load questions and extract units/chapters on mount
   */
  useEffect(() => {
    async function loadData() {
      if (!examSlug) {
        setError('No exam specified');
        setLoading(false);
        return;
      }

      // Validate exam slug
      if (!EXAM_DETAILS[examSlug]) {
        setError('Invalid exam');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const questions = await loadExamQuestions(examSlug);

        if (questions.length === 0) {
          throw new Error('No questions found for this exam');
        }

        const extractedUnits = extractUnitsWithChapters(questions, examSlug);
        setUnits(extractedUnits);

        // Expand first unit by default
        if (extractedUnits.length > 0 && extractedUnits[0]) {
          setExpandedUnits(new Set([extractedUnits[0].unitId]));
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [examSlug]);

  /**
   * Toggle unit expansion
   */
  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  /**
   * Start practice for a specific chapter
   */
  const startChapterPractice = (unitId: string, chapterId: string) => {
    if (!examSlug) return;

    const params = new URLSearchParams({
      exam: examSlug,
      unit: unitId,
      chapter: chapterId,
    });

    navigate(`/quiz?${params.toString()}`);
  };


  /**
   * Render progress bar
   */
  const renderProgressBar = (progress: ProgressInfo) => {
    const percentage = progress.percentage;

    let colorClass = 'bg-gray-300';
    if (percentage >= 80) {
      colorClass = 'bg-green-500';
    } else if (percentage >= 50) {
      colorClass = 'bg-yellow-500';
    } else if (percentage > 0) {
      colorClass = 'bg-blue-500';
    }

    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${colorClass} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 w-12 text-right">
          {percentage}%
        </span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !examSlug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-error-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Invalid exam'}</p>
          <Button variant="primary" onClick={() => navigate(examSlug ? `/exam/${examSlug}` : '/')}>
            Back to Exam
          </Button>
        </Card>
      </div>
    );
  }

  const exam = EXAM_DETAILS[examSlug];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(`/exam/${examSlug}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-500">{exam.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice by Unit & Chapter</h1>
          <p className="text-gray-600">
            Select a chapter below to practice questions from that specific topic
          </p>
        </div>

        {/* Units List */}
        <div className="space-y-4">
          {units.map((unit) => {
            const isExpanded = expandedUnits.has(unit.unitId);

            return (
              <Card key={unit.unitId} padding="none" className="overflow-hidden">
                {/* Unit Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleUnit(unit.unitId)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <svg
                        className="h-5 w-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Unit {unit.unitNumber}: {unit.unitTitle}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {unit.questionCount} questions · {unit.chapters.length} chapters
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </span>
                  </div>
                </div>

                {/* Chapters List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4 space-y-3">
                      {unit.chapters.map((chapter) => (
                        <div
                          key={chapter.chapterId}
                          className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                          onClick={() => startChapterPractice(unit.unitId, chapter.chapterId)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                Chapter {chapter.chapterId}: {chapter.chapterTitle}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {chapter.questionCount} questions
                              </p>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                startChapterPractice(unit.unitId, chapter.chapterId);
                              }}
                            >
                              <svg
                                className="h-4 w-4 mr-1 inline-block"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Practice
                            </Button>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs text-gray-600">
                                {chapter.progress.attempted} / {chapter.questionCount} attempted
                              </span>
                            </div>
                            {renderProgressBar(chapter.progress)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Click on a unit to expand and see its chapters</p>
          <p>Click the <strong>Practice</strong> button on any chapter to start</p>
        </div>

        {/* Mock Test Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How Mock Tests Work</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>10 pre-defined mock tests</strong> are available for each exam</li>
            <li>• Each test uses <strong>seeded randomization</strong> - the same test number always generates the same questions</li>
            <li>• Questions are <strong>balanced across units</strong> with 40% easy, 40% medium, 20% hard difficulty</li>
            <li>• Your progress is saved locally and to your account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
