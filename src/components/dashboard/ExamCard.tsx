import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface ExamCardProps {
  exam: {
    name: string;
    slug: string;
    description: string;
    icon?: string;
  };
  progress: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    accuracy: number;
  };
  onContinuePractice: () => void;
  onStartMockExam: () => void;
}

export const ExamCard = React.memo<ExamCardProps>(({
  exam,
  progress,
  onContinuePractice,
  onStartMockExam,
}) => {
  const progressPercentage = useMemo(() => {
    return Math.round((progress.answeredQuestions / progress.totalQuestions) * 100);
  }, [progress.answeredQuestions, progress.totalQuestions]);

  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 45; // radius = 45
    return circumference - (progressPercentage / 100) * circumference;
  }, [progressPercentage]);

  return (
    <Card variant="elevated" hoverable padding="lg" className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {exam.icon && (
          <div className="flex-shrink-0 text-4xl" aria-hidden="true">
            {exam.icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{exam.name}</h3>
          <p className="text-sm text-gray-600">{exam.description}</p>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center my-6">
        <div className="relative">
          <svg className="transform -rotate-90" width="120" height="120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-accent-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
            <span className="text-xs text-gray-600">Complete</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{progress.answeredQuestions}</p>
          <p className="text-xs text-gray-600">Attempted</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent-600">{progress.accuracy}%</p>
          <p className="text-xs text-gray-600">Accuracy</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onContinuePractice}
        >
          Continue Practice
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={onStartMockExam}
        >
          Mock Exam
        </Button>
      </div>
    </Card>
  );
});

ExamCard.displayName = 'ExamCard';
