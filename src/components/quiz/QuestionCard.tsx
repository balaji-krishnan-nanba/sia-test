import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { DifficultyBadge } from '../ui/Badge';
import { AnswerOptions } from './AnswerOptions';
import { ExplanationPanel } from './ExplanationPanel';

export interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: {
    id: string;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    unitTitle?: string;
    chapterTitle?: string;
  };
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  disabled?: boolean;
}

export const QuestionCard = React.memo<QuestionCardProps>(({
  questionNumber,
  totalQuestions,
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  isCorrect = false,
  isBookmarked = false,
  onBookmarkToggle,
  disabled = false,
}) => {
  return (
    <Card padding="lg" className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <DifficultyBadge difficulty={question.difficulty} size="sm" />
        </div>
        {onBookmarkToggle && (
          <button
            onClick={onBookmarkToggle}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <svg className="h-6 w-6 text-warning-500 fill-current" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Unit and Chapter Info */}
      {(question.unitTitle || question.chapterTitle) && (
        <div className="mb-4 text-sm text-gray-600">
          {question.unitTitle && <span>{question.unitTitle}</span>}
          {question.unitTitle && question.chapterTitle && <span className="mx-2">•</span>}
          {question.chapterTitle && <span>{question.chapterTitle}</span>}
        </div>
      )}

      {/* Question Text */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <AnswerOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={showResult ? question.correctAnswer : undefined}
        showResult={showResult}
        onSelect={onAnswerSelect}
        disabled={disabled}
      />

      {/* Explanation Panel */}
      <ExplanationPanel
        explanation={question.explanation}
        isCorrect={isCorrect}
        correctAnswer={question.correctAnswer}
        show={showResult}
      />

      {/* Keyboard Shortcuts Hint */}
      {!showResult && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Use keyboard shortcuts: Press <kbd className="px-2 py-1 bg-gray-100 rounded">1-4</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded">A-D</kbd> to select an answer
          </p>
        </div>
      )}
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';
