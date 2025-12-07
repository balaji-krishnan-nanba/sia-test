import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card = React.memo<CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 transition-all duration-200';

  const variantStyles = {
    default: 'shadow-card',
    elevated: 'shadow-elevated',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hoverable
    ? 'cursor-pointer hover:shadow-elevated hover:-translate-y-0.5'
    : '';

  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
