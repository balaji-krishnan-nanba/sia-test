import React from 'react';
import type { DifficultyLevel } from '../../types/question';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'easy' | 'medium' | 'hard' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge = React.memo<BadgeProps>(({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    easy: 'bg-accent-100 text-accent-700',
    medium: 'bg-warning-100 text-warning-700',
    hard: 'bg-error-100 text-error-700',
    success: 'bg-accent-100 text-accent-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-secondary-100 text-secondary-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// Helper component for difficulty badges
export const DifficultyBadge = React.memo<{ difficulty: DifficultyLevel; size?: 'sm' | 'md' }>(
  ({ difficulty, size = 'md' }) => {
    const labels = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    };

    return (
      <Badge variant={difficulty} size={size}>
        {labels[difficulty]}
      </Badge>
    );
  }
);

DifficultyBadge.displayName = 'DifficultyBadge';
