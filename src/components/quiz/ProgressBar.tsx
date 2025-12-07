import React, { useMemo } from 'react';

export interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
  incorrect: number;
  className?: string;
}

export const ProgressBar = React.memo<ProgressBarProps>(({
  current,
  total,
  correct,
  incorrect,
  className = '',
}) => {
  const progressPercentage = useMemo(() => {
    return (current / total) * 100;
  }, [current, total]);

  const accuracy = useMemo(() => {
    const answered = correct + incorrect;
    if (answered === 0) return 0;
    return Math.round((correct / answered) * 100);
  }, [correct, incorrect]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-card p-4 ${className}`}>
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {current} <span className="text-base font-normal text-gray-500">/ {total}</span>
            </p>
            <p className="text-xs text-gray-600">Questions</p>
          </div>

          {(correct > 0 || incorrect > 0) && (
            <>
              <div className="h-10 w-px bg-gray-300" />
              <div>
                <p className="text-2xl font-bold text-accent-600">
                  {accuracy}%
                </p>
                <p className="text-xs text-gray-600">Accuracy</p>
              </div>
            </>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="flex items-center gap-4 text-sm">
          {correct > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-accent-500" />
              <span className="text-gray-700">
                <strong className="font-semibold">{correct}</strong> correct
              </span>
            </div>
          )}
          {incorrect > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-error-500" />
              <span className="text-gray-700">
                <strong className="font-semibold">{incorrect}</strong> incorrect
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-500 to-accent-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={current}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`Progress: ${current} of ${total} questions answered`}
          />
        </div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
