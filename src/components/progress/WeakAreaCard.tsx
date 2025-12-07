import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { WeakArea } from '@/utils/scorer';

export interface WeakAreaCardProps {
  weakArea: WeakArea;
  onPractice?: (identifier: string) => void;
}

export const WeakAreaCard = React.memo<WeakAreaCardProps>(({
  weakArea,
  onPractice,
}) => {
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'unit':
        return '📚';
      case 'chapter':
        return '📖';
      case 'difficulty':
        return '⚡';
      default:
        return '⚠';
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'unit':
        return 'Unit';
      case 'chapter':
        return 'Chapter';
      case 'difficulty':
        return 'Difficulty';
      default:
        return 'Area';
    }
  };

  return (
    <Card
      padding="lg"
      className="border-l-4 border-warning-500 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getTypeIcon(weakArea.type)}</span>
            <div>
              <Badge variant="warning" size="sm">
                {getTypeLabel(weakArea.type)}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {weakArea.label}
          </h4>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3">
            <div>
              <span className="text-2xl font-bold text-warning-600">
                {Math.round(weakArea.accuracy)}%
              </span>
              <span className="text-sm text-gray-600 ml-2">accuracy</span>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <span className="text-sm text-gray-600">
                <strong className="font-semibold text-gray-900">
                  {weakArea.totalAttempts}
                </strong>{' '}
                questions attempted
              </span>
            </div>
          </div>

          {/* Recommendation */}
          <p className="text-sm text-gray-700 mb-4 bg-warning-50 p-3 rounded-md border border-warning-200">
            <span className="font-medium text-warning-800">Tip:</span>{' '}
            {weakArea.recommendation}
          </p>

          {/* Action Button */}
          {onPractice && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPractice(weakArea.identifier)}
              fullWidth
            >
              Practice Now
            </Button>
          )}
        </div>

        {/* Visual Indicator */}
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray={`${weakArea.accuracy} ${100 - weakArea.accuracy}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">
                {Math.round(weakArea.accuracy)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

WeakAreaCard.displayName = 'WeakAreaCard';
