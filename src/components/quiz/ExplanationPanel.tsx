import React from 'react';

export interface ExplanationPanelProps {
  explanation: string;
  isCorrect: boolean;
  correctAnswer: string;
  show: boolean;
}

export const ExplanationPanel = React.memo<ExplanationPanelProps>(({
  explanation,
  isCorrect,
  correctAnswer,
  show,
}) => {
  if (!show) return null;

  return (
    <div
      className={`mt-6 rounded-lg border-l-4 p-4 animate-slide-up ${
        isCorrect
          ? 'border-accent-500 bg-accent-50'
          : 'border-error-500 bg-error-50'
      }`}
      role="region"
      aria-label="Answer explanation"
      aria-live="polite"
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        {isCorrect ? (
          <>
            <svg className="h-6 w-6 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-accent-900">Correct!</h3>
          </>
        ) : (
          <>
            <svg className="h-6 w-6 text-error-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-error-900">Incorrect</h3>
              <p className="text-sm text-error-700">The correct answer is <strong>{correctAnswer}</strong></p>
            </div>
          </>
        )}
      </div>

      {/* Explanation */}
      <div className={`text-sm leading-relaxed ${
        isCorrect ? 'text-accent-800' : 'text-error-800'
      }`}>
        <p className="font-medium mb-1">Explanation:</p>
        <p>{explanation}</p>
      </div>
    </div>
  );
});

ExplanationPanel.displayName = 'ExplanationPanel';
