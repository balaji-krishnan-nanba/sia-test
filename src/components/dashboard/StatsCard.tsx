import React from 'react';
import { Card } from '../ui/Card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const StatsCard = React.memo<StatsCardProps>(({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      valueColor: 'text-gray-900',
    },
    primary: {
      bg: 'bg-primary-50',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-900',
    },
    success: {
      bg: 'bg-accent-50',
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
      valueColor: 'text-accent-900',
    },
    warning: {
      bg: 'bg-warning-50',
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
      valueColor: 'text-warning-900',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card padding="lg" className={`${styles.bg} border-0`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${styles.valueColor}`}>{value}</p>
            {trend && (
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  trend.isPositive ? 'text-accent-600' : 'text-error-600'
                }`}
              >
                {trend.isPositive ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`flex-shrink-0 p-3 rounded-lg ${styles.iconBg}`}>
            <div className={`h-6 w-6 ${styles.iconColor}`}>{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';
