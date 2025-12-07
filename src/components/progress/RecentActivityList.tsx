import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getRelativeTime } from '@/utils/date';

export interface ActivityItem {
  id: string;
  type: 'practice' | 'mock-exam' | 'quiz';
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  unitId?: string;
  chapterId?: string;
}

export interface RecentActivityListProps {
  activities: ActivityItem[];
  loading?: boolean;
  limit?: number;
}

export const RecentActivityList = React.memo<RecentActivityListProps>(({
  activities,
  loading = false,
  limit = 10,
}) => {
  const displayActivities = activities.slice(0, limit);

  if (loading) {
    return (
      <Card padding="lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <Card padding="lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📅</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No Activity Yet
          </h4>
          <p className="text-gray-600">
            Start practicing to see your recent activity here
          </p>
        </div>
      </Card>
    );
  }

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'mock-exam':
        return '📝';
      case 'quiz':
        return '❓';
      case 'practice':
      default:
        return '📚';
    }
  };

  const getActivityLabel = (type: string): string => {
    switch (type) {
      case 'mock-exam':
        return 'Mock Exam';
      case 'quiz':
        return 'Quiz';
      case 'practice':
      default:
        return 'Practice';
    }
  };

  const getActivityColor = (accuracy: number): string => {
    if (accuracy >= 80) return 'bg-accent-100 text-accent-700';
    if (accuracy >= 60) return 'bg-warning-100 text-warning-700';
    return 'bg-error-100 text-error-700';
  };

  return (
    <Card padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
        <Badge variant="default" size="sm">
          Last {displayActivities.length} sessions
        </Badge>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {displayActivities.map((activity, index) => {
          const accuracy = activity.questionsAnswered > 0
            ? Math.round((activity.correctAnswers / activity.questionsAnswered) * 100)
            : 0;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-50 rounded-full text-2xl">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Type and Time */}
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" size="sm">
                    {getActivityLabel(activity.type)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {getRelativeTime(activity.date)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-900 mb-2">
                  {activity.unitId && (
                    <span className="font-medium">
                      {activity.unitId}
                      {activity.chapterId && ` - Chapter ${activity.chapterId}`}
                    </span>
                  )}
                  {!activity.unitId && (
                    <span className="font-medium">General Practice</span>
                  )}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-semibold text-gray-900">
                      {activity.questionsAnswered}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-600">Correct:</span>
                    <span className="font-semibold text-accent-600">
                      {activity.correctAnswers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accuracy Badge */}
              <div className="flex-shrink-0">
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-bold ${getActivityColor(accuracy)}`}
                >
                  {accuracy}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Link */}
      {activities.length > limit && (
        <div className="mt-6 text-center">
          <button className="text-sm font-medium text-primary hover:text-primary-600 transition-colors">
            View All Activity ({activities.length} total)
          </button>
        </div>
      )}
    </Card>
  );
});

RecentActivityList.displayName = 'RecentActivityList';
