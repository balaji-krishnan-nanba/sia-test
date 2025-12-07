import React, { useMemo } from 'react';
import { Card } from '../ui/Card';

export interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

export const StreakDisplay = React.memo<StreakDisplayProps>(({
  currentStreak,
  longestStreak,
  lastActiveDate,
}) => {
  const motivationalMessage = useMemo(() => {
    if (currentStreak === 0) return "Start your learning streak today!";
    if (currentStreak === 1) return "Great start! Keep it going!";
    if (currentStreak < 7) return "You're building momentum!";
    if (currentStreak < 30) return "Amazing consistency!";
    if (currentStreak < 100) return "You're on fire!";
    return "Legendary dedication!";
  }, [currentStreak]);

  const nextMilestone = useMemo(() => {
    if (currentStreak < 7) return { target: 7, name: "Week" };
    if (currentStreak < 30) return { target: 30, name: "Month" };
    if (currentStreak < 100) return { target: 100, name: "Century" };
    if (currentStreak < 365) return { target: 365, name: "Year" };
    return null;
  }, [currentStreak]);

  const milestoneProgress = useMemo(() => {
    if (!nextMilestone) return 100;
    return Math.round((currentStreak / nextMilestone.target) * 100);
  }, [currentStreak, nextMilestone]);

  const isActive = useMemo(() => {
    if (!lastActiveDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 1;
  }, [lastActiveDate]);

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center gap-4">
        {/* Streak Icon */}
        <div className={`flex-shrink-0 text-6xl ${isActive ? 'animate-pulse' : ''}`}>
          {currentStreak > 0 ? '🔥' : '📚'}
        </div>

        {/* Streak Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {currentStreak > 0 ? `${currentStreak} Day Streak!` : 'No Streak Yet'}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{motivationalMessage}</p>

          {/* Progress to Next Milestone */}
          {nextMilestone && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Next: {nextMilestone.name} Streak
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {currentStreak}/{nextMilestone.target}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-warning-500 to-error-500 transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Longest Streak Badge */}
        {longestStreak > 0 && (
          <div className="flex-shrink-0 text-center px-4 py-2 bg-warning-50 rounded-lg border border-warning-200">
            <p className="text-2xl font-bold text-warning-700">{longestStreak}</p>
            <p className="text-xs text-warning-600">Best</p>
          </div>
        )}
      </div>

      {/* Calendar Mini-View (Optional - showing last 7 days) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Last 7 Days</p>
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayIndex = 6 - i;
            const isActiveDay = dayIndex < currentStreak;
            return (
              <div
                key={i}
                className={`flex-1 h-8 rounded ${
                  isActiveDay
                    ? 'bg-accent-500'
                    : 'bg-gray-200'
                }`}
                title={isActiveDay ? 'Active' : 'Inactive'}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
});

StreakDisplay.displayName = 'StreakDisplay';
