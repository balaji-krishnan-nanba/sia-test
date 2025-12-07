import React, { useState, useEffect, useCallback, useMemo } from 'react';

export interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isRunning: boolean;
  onPause?: () => void;
  onResume?: () => void;
  showControls?: boolean;
}

export const Timer = React.memo<TimerProps>(({
  duration,
  onTimeUp,
  isRunning,
  onPause,
  onResume,
  showControls = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(!isRunning);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    setIsPaused(!isRunning);
  }, [isRunning]);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const percentage = useMemo(() => {
    return (timeRemaining / duration) * 100;
  }, [timeRemaining, duration]);

  const colorClass = useMemo(() => {
    if (timeRemaining <= 60) return 'text-error-600'; // Critical: < 1 min
    if (timeRemaining <= 300) return 'text-warning-600'; // Warning: < 5 min
    return 'text-secondary-600'; // Normal
  }, [timeRemaining]);

  const bgColorClass = useMemo(() => {
    if (timeRemaining <= 60) return 'bg-error-50 border-error-300';
    if (timeRemaining <= 300) return 'bg-warning-50 border-warning-300';
    return 'bg-secondary-50 border-secondary-300';
  }, [timeRemaining]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      onResume?.();
    } else {
      setIsPaused(true);
      onPause?.();
    }
  }, [isPaused, onPause, onResume]);

  // Alert when time is running out
  useEffect(() => {
    if (timeRemaining === 60) {
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Time Warning', {
          body: 'Only 1 minute remaining!',
          icon: '/favicon.ico',
        });
      }
    }
  }, [timeRemaining]);

  return (
    <div className={`rounded-lg border-2 p-4 transition-colors ${bgColorClass}`}>
      <div className="flex items-center justify-between">
        {/* Timer Display */}
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className={`text-3xl font-bold font-mono ${colorClass}`}>
              {formattedTime}
            </p>
            <p className="text-xs text-gray-600">
              {timeRemaining <= 60 ? 'Hurry up!' : timeRemaining <= 300 ? 'Time running out' : 'Time remaining'}
            </p>
          </div>
        </div>

        {/* Controls */}
        {showControls && onPause && onResume && (
          <button
            onClick={handlePauseResume}
            className="p-2 rounded-md hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
          >
            {isPaused ? (
              <svg className="h-6 w-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              timeRemaining <= 60
                ? 'bg-error-500'
                : timeRemaining <= 300
                ? 'bg-warning-500'
                : 'bg-secondary-500'
            }`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={timeRemaining}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-label="Time remaining"
          />
        </div>
      </div>

      {isPaused && (
        <p className="mt-2 text-sm text-center text-gray-600 font-medium">
          Timer Paused
        </p>
      )}
    </div>
  );
});

Timer.displayName = 'Timer';
