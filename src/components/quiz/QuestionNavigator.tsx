import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface QuestionStatus {
  answered: boolean;
  flagged: boolean;
  correct?: boolean;
}

export interface QuestionNavigatorProps {
  questions: QuestionStatus[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  mode?: 'sidebar' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
}

export const QuestionNavigator = React.memo<QuestionNavigatorProps>(({
  questions,
  currentIndex,
  onNavigate,
  mode = 'modal',
  isOpen = true,
  onClose,
}) => {
  const answeredCount = questions.filter((q) => q.answered).length;
  const flaggedCount = questions.filter((q) => q.flagged).length;

  const getQuestionButtonStyles = (index: number, question: QuestionStatus): string => {
    const baseStyles = 'w-12 h-12 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative';

    if (index === currentIndex) {
      return `${baseStyles} bg-primary-600 text-white ring-2 ring-primary-500`;
    }

    if (question.answered) {
      if (question.correct !== undefined) {
        return question.correct
          ? `${baseStyles} bg-accent-100 text-accent-700 border-2 border-accent-500 hover:bg-accent-200`
          : `${baseStyles} bg-error-100 text-error-700 border-2 border-error-500 hover:bg-error-200`;
      }
      return `${baseStyles} bg-secondary-100 text-secondary-700 border-2 border-secondary-400 hover:bg-secondary-200`;
    }

    return `${baseStyles} bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400`;
  };

  const NavigatorContent = () => (
    <div className="flex flex-col h-full">
      {/* Summary */}
      <div className="mb-6 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Question Navigator</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-secondary-400" />
            <span>{answeredCount} answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-gray-300" />
            <span>{questions.length - answeredCount} unanswered</span>
          </div>
          {flaggedCount > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="h-3 w-3 text-warning-500 fill-current" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              <span>{flaggedCount} flagged</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-3 overflow-y-auto flex-1">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => {
              onNavigate(index);
              if (mode === 'modal' && onClose) {
                onClose();
              }
            }}
            className={getQuestionButtonStyles(index, question)}
            aria-label={`Question ${index + 1}${question.answered ? ' (answered)' : ''}${question.flagged ? ' (flagged)' : ''}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          >
            <span>{index + 1}</span>
            {question.flagged && (
              <svg
                className="absolute -top-1 -right-1 h-4 w-4 text-warning-500 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Legend:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary-100 border-2 border-secondary-400" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-100 border-2 border-accent-500" />
            <span>Correct</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === 'modal') {
    return (
      <Modal isOpen={isOpen} onClose={onClose || (() => {})} title="Navigate Questions" size="md">
        <NavigatorContent />
      </Modal>
    );
  }

  // Sidebar mode
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-card p-6 h-full">
      <NavigatorContent />
    </div>
  );
});

QuestionNavigator.displayName = 'QuestionNavigator';
