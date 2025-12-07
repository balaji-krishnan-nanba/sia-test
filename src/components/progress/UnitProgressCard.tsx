import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';

export interface ChapterData {
  chapterId: string;
  chapterTitle: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface UnitProgressCardProps {
  unitId: string;
  unitTitle: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
  chapters: ChapterData[];
  onPractice?: (unitId: string) => void;
}

export const UnitProgressCard = React.memo<UnitProgressCardProps>(({
  unitId,
  unitTitle,
  totalQuestions,
  answeredQuestions,
  correctAnswers,
  accuracy,
  chapters,
  onPractice,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const progressPercentage = totalQuestions > 0
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

  const getAccuracyVariant = (acc: number): 'success' | 'warning' | 'error' => {
    if (acc >= 80) return 'success';
    if (acc >= 60) return 'warning';
    return 'error';
  };

  const getAccuracyIcon = (acc: number): string => {
    if (acc >= 80) return '✓';
    if (acc >= 60) return '⚠';
    return '✗';
  };

  return (
    <Card padding="lg" className="hover:shadow-lg transition-all duration-200">
      {/* Unit Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {unitId}: {unitTitle}
            </h3>
            {answeredQuestions > 0 && (
              <Badge variant={getAccuracyVariant(accuracy)} size="sm">
                {Math.round(accuracy)}% {getAccuracyIcon(accuracy)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {answeredQuestions} / {totalQuestions} questions practiced
          </p>
        </div>
        <ProgressRing
          progress={accuracy || 0}
          size="sm"
          color={accuracy >= 80 ? 'accent' : accuracy >= 60 ? 'warning' : 'error'}
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{answeredQuestions}</p>
          <p className="text-xs text-gray-600">Attempted</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent-600">{correctAnswers}</p>
          <p className="text-xs text-gray-600">Correct</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-error-600">
            {answeredQuestions - correctAnswers}
          </p>
          <p className="text-xs text-gray-600">Incorrect</p>
        </div>
      </div>

      {/* Chapter Breakdown Toggle */}
      {chapters.length > 0 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            {isExpanded ? 'Hide' : 'Show'} Chapter Breakdown
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Chapter List */}
          {isExpanded && (
            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
              {chapters.map((chapter) => {
                const chapterProgress = chapter.totalQuestions > 0
                  ? Math.round((chapter.answeredQuestions / chapter.totalQuestions) * 100)
                  : 0;

                return (
                  <div
                    key={chapter.chapterId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          Chapter {chapter.chapterId}
                        </p>
                        {chapter.answeredQuestions > 0 && (
                          <Badge
                            variant={getAccuracyVariant(chapter.accuracy)}
                            size="sm"
                          >
                            {Math.round(chapter.accuracy)}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{chapter.chapterTitle}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${chapterProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 min-w-[60px] text-right">
                          {chapter.answeredQuestions}/{chapter.totalQuestions}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Practice Button */}
      {onPractice && (
        <button
          onClick={() => onPractice(unitId)}
          className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors font-medium text-sm"
        >
          Practice This Unit
        </button>
      )}
    </Card>
  );
});

UnitProgressCard.displayName = 'UnitProgressCard';
