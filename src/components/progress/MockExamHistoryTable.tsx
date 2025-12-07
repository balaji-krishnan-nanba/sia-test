import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDuration } from '@/utils/date';

export interface MockExamAttempt {
  id: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  passingScore: number;
  passed: boolean;
  correctAnswers: number;
  timeSpent: number; // in seconds
}

export interface MockExamHistoryTableProps {
  attempts: MockExamAttempt[];
  onReview?: (attemptId: string) => void;
  loading?: boolean;
}

export const MockExamHistoryTable = React.memo<MockExamHistoryTableProps>(({
  attempts,
  onReview,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  if (attempts.length === 0) {
    return (
      <Card padding="lg">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Mock Exams Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Take your first mock exam to see your results here
          </p>
        </div>
      </Card>
    );
  }

  // Calculate trend
  const getTrend = (): { trend: 'improving' | 'declining' | 'stable'; icon: string } => {
    if (attempts.length < 2) return { trend: 'stable', icon: '−' };

    const recent = attempts.slice(0, Math.min(3, attempts.length));
    const scores = recent.map(a => (a.correctAnswers / a.totalQuestions) * 100);

    if (scores.length < 2) return { trend: 'stable', icon: '−' };

    const avgChange = scores.slice(0, -1).reduce((sum, score, i) =>
      sum + (score - (scores[i + 1] ?? 0)), 0) / (scores.length - 1);

    if (avgChange > 5) return { trend: 'improving', icon: '↗' };
    if (avgChange < -5) return { trend: 'declining', icon: '↘' };
    return { trend: 'stable', icon: '→' };
  };

  const { trend, icon } = getTrend();

  return (
    <Card padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Mock Exam History</h3>
          <p className="text-sm text-gray-600">
            {attempts.length} exam{attempts.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Trend:</span>
          <Badge
            variant={trend === 'improving' ? 'success' : trend === 'declining' ? 'warning' : 'default'}
            size="sm"
          >
            {icon} {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                Date
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                Score
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                Percentage
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                Time
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                Result
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => {
              const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);

              return (
                <tr
                  key={attempt.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(attempt.completedAt, 'PPP')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(attempt.completedAt, 'p')}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {attempt.correctAnswers}/{attempt.totalQuestions}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {percentage}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-600">
                      {formatDuration(attempt.timeSpent)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={attempt.passed ? 'success' : 'error'}
                      size="sm"
                    >
                      {attempt.passed ? 'PASS ✓' : 'FAIL ✗'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {onReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReview(attempt.id)}
                      >
                        Review
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {attempts.map((attempt) => {
          const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);

          return (
            <div
              key={attempt.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(attempt.completedAt, 'PPP')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(attempt.completedAt, 'p')}
                  </div>
                </div>
                <Badge
                  variant={attempt.passed ? 'success' : 'error'}
                  size="sm"
                >
                  {attempt.passed ? 'PASS ✓' : 'FAIL ✗'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Score</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {attempt.correctAnswers}/{attempt.totalQuestions}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Percentage</p>
                  <p className="text-lg font-bold text-gray-900">{percentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Time</p>
                  <p className="text-sm text-gray-900">
                    {formatDuration(attempt.timeSpent)}
                  </p>
                </div>
              </div>

              {onReview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReview(attempt.id)}
                  fullWidth
                >
                  Review Answers
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
});

MockExamHistoryTable.displayName = 'MockExamHistoryTable';
