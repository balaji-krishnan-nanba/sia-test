import React, { useEffect } from 'react';

export interface AnswerOptionsProps {
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  selectedAnswer: string | null;
  correctAnswer?: string;
  showResult?: boolean;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export const AnswerOptions = React.memo<AnswerOptionsProps>(({
  options,
  selectedAnswer,
  correctAnswer,
  showResult = false,
  onSelect,
  disabled = false,
}) => {
  const optionKeys = ['A', 'B', 'C', 'D'] as const;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;

      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key) - 1;
        const answer = optionKeys[index];
        if (answer) {
          onSelect(answer);
        }
      } else if (optionKeys.includes(key.toUpperCase() as 'A' | 'B' | 'C' | 'D')) {
        onSelect(key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, onSelect]);

  const getOptionStyles = (optionKey: string): string => {
    const baseStyles = 'w-full text-left px-4 py-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] flex items-start gap-3';

    if (disabled && !showResult) {
      return `${baseStyles} border-gray-300 bg-gray-50 cursor-not-allowed opacity-50`;
    }

    if (showResult && correctAnswer) {
      if (optionKey === correctAnswer) {
        return `${baseStyles} border-accent-500 bg-accent-50 text-accent-900 font-medium`;
      }
      if (optionKey === selectedAnswer && optionKey !== correctAnswer) {
        return `${baseStyles} border-error-500 bg-error-50 text-error-900`;
      }
      return `${baseStyles} border-gray-300 bg-gray-50 text-gray-600`;
    }

    if (selectedAnswer === optionKey) {
      return `${baseStyles} border-primary-500 bg-primary-50 text-primary-900 font-medium hover:bg-primary-100 focus:ring-primary-500`;
    }

    return `${baseStyles} border-gray-300 bg-white hover:border-primary-300 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100`;
  };

  const getIcon = (optionKey: string): React.ReactNode | null => {
    if (!showResult || !correctAnswer) return null;

    if (optionKey === correctAnswer) {
      return (
        <svg className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }

    if (optionKey === selectedAnswer && optionKey !== correctAnswer) {
      return (
        <svg className="h-5 w-5 text-error-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Answer options">
      {optionKeys.map((optionKey, index) => (
        <button
          key={optionKey}
          onClick={() => !disabled && onSelect(optionKey)}
          disabled={disabled && !showResult}
          className={getOptionStyles(optionKey)}
          role="radio"
          aria-checked={selectedAnswer === optionKey}
          aria-label={`Option ${optionKey}: ${options[optionKey]}`}
        >
          <span className="flex-shrink-0 font-semibold text-gray-700">
            {optionKey}.
          </span>
          <span className="flex-1">
            {options[optionKey]}
          </span>
          {getIcon(optionKey)}
          <span className="sr-only">(Press {index + 1})</span>
        </button>
      ))}
    </div>
  );
});

AnswerOptions.displayName = 'AnswerOptions';
