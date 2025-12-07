import React, { useMemo } from 'react';

export interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  thickness?: number;
  color?: 'primary' | 'accent' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

export const ProgressRing = React.memo<ProgressRingProps>(({
  progress,
  size = 'md',
  thickness,
  color = 'accent',
  showLabel = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { dimension: 60, defaultThickness: 4, fontSize: 'text-xs' },
    md: { dimension: 80, defaultThickness: 6, fontSize: 'text-sm' },
    lg: { dimension: 120, defaultThickness: 8, fontSize: 'text-lg' },
  };

  const colorMap = {
    primary: 'text-primary',
    accent: 'text-accent-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
  };

  const { dimension, defaultThickness, fontSize } = sizeMap[size];
  const strokeWidth = thickness || defaultThickness;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = useMemo(() => {
    const validProgress = Math.min(100, Math.max(0, progress));
    return circumference - (validProgress / 100) * circumference;
  }, [progress, circumference]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorMap[color]} transition-all duration-500`}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${fontSize} text-gray-900`}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
});

ProgressRing.displayName = 'ProgressRing';
