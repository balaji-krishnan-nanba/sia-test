import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface UnitBreakdown {
  unitNumber: number;
  unitTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  timeUsed: number; // in seconds
  timeLimit: number; // in seconds
  unitBreakdown: UnitBreakdown[];
  onReviewAnswers: () => void;
  onRetake: () => void;
  onDashboard: () => void;
  showCelebration?: boolean;
}

export const ResultsScreen = React.memo<ResultsScreenProps>(({
  score,
  totalQuestions,
  percentage,
  passed,
  passingScore,
  timeUsed,
  timeLimit,
  unitBreakdown,
  onReviewAnswers,
  onRetake,
  onDashboard,
  showCelebration = true,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const averageTimePerQuestion = useMemo(() => {
    return Math.round(timeUsed / totalQuestions);
  }, [timeUsed, totalQuestions]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Pass/Fail Indicator */}
      <div
        className={`text-center mb-8 ${
          passed ? 'animate-fade-in' : ''
        }`}
      >
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            passed ? 'bg-accent-100' : 'bg-error-100'
          }`}
        >
          {passed ? (
            <svg className="w-16 h-16 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-error-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <h1
          className={`text-4xl font-bold mb-2 ${
            passed ? 'text-accent-900' : 'text-error-900'
          }`}
        >
          {passed ? 'Congratulations!' : 'Not Quite There'}
        </h1>
        <p className="text-xl text-gray-600">
          {passed
            ? 'You passed the mock exam!'
            : `You need ${passingScore}% to pass. Keep practicing!`}
        </p>
      </div>

      {/* Score Card */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Score */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Score</p>
            <p className="text-5xl font-bold text-gray-900 mb-1">
              {score}<span className="text-2xl text-gray-500">/{totalQuestions}</span>
            </p>
            <p
              className={`text-2xl font-semibold ${
                passed ? 'text-accent-600' : 'text-error-600'
              }`}
            >
              {percentage}%
            </p>
          </div>

          {/* Time */}
          <div className="text-center border-l border-r border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Time Used</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {formatTime(timeUsed)}
            </p>
            <p className="text-sm text-gray-500">
              of {formatTime(timeLimit)} available
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Avg: {averageTimePerQuestion}s per question
            </p>
          </div>

          {/* Passing Score */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Required to Pass</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{passingScore}%</p>
            <p
              className={`text-sm font-medium ${
                percentage >= passingScore ? 'text-accent-600' : 'text-error-600'
              }`}
            >
              {percentage >= passingScore
                ? `+${(percentage - passingScore).toFixed(1)}% above`
                : `${(passingScore - percentage).toFixed(1)}% below`}
            </p>
          </div>
        </div>
      </Card>

      {/* Unit Breakdown */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance by Unit</h2>
        <div className="space-y-4">
          {unitBreakdown.map((unit) => (
            <div key={unit.unitNumber}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Unit {unit.unitNumber}: {unit.unitTitle}
                  </p>
                  <p className="text-xs text-gray-600">
                    {unit.correctAnswers} / {unit.totalQuestions} correct
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    unit.accuracy >= 80
                      ? 'text-accent-600'
                      : unit.accuracy >= 60
                      ? 'text-warning-600'
                      : 'text-error-600'
                  }`}
                >
                  {unit.accuracy}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    unit.accuracy >= 80
                      ? 'bg-accent-500'
                      : unit.accuracy >= 60
                      ? 'bg-warning-500'
                      : 'bg-error-500'
                  }`}
                  style={{ width: `${unit.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onReviewAnswers}
          leftIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          Review Answers
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={onRetake}
          leftIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          Retake Exam
        </Button>
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={onDashboard}
          leftIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Celebration Animation */}
      {passed && showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
});

ResultsScreen.displayName = 'ResultsScreen';
