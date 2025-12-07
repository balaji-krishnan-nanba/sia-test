/**
 * Quiz Results Screen - Display results after completing a practice quiz
 */

import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Question, DifficultyLevel } from '@/types/question';

export interface QuizResultsScreenProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Array<{
    questionId: string;
    userAnswer: string | null;
    isCorrect: boolean;
  }>;
  onRetry: () => void;
  onDashboard: () => void;
}

interface DifficultyBreakdown {
  difficulty: DifficultyLevel;
  total: number;
  correct: number;
  accuracy: number;
}

export const QuizResultsScreen = React.memo<QuizResultsScreenProps>(
  ({ score, totalQuestions, questions, userAnswers, onRetry, onDashboard }) => {
    // Calculate percentage
    const percentage = useMemo(() => {
      return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    }, [score, totalQuestions]);

    // Check if passed (70% or higher)
    const passed = percentage >= 70;
    const passingScore = 70;

    // Calculate breakdown by difficulty
    const difficultyBreakdown = useMemo((): DifficultyBreakdown[] => {
      const breakdown: Record<DifficultyLevel, { total: number; correct: number }> = {
        easy: { total: 0, correct: 0 },
        medium: { total: 0, correct: 0 },
        hard: { total: 0, correct: 0 },
      };

      questions.forEach((question, index) => {
        const answer = userAnswers[index];
        if (answer) {
          breakdown[question.difficulty].total++;
          if (answer.isCorrect) {
            breakdown[question.difficulty].correct++;
          }
        }
      });

      return Object.entries(breakdown)
        .filter(([_, stats]) => stats.total > 0)
        .map(([difficulty, stats]) => ({
          difficulty: difficulty as DifficultyLevel,
          total: stats.total,
          correct: stats.correct,
          accuracy: Math.round((stats.correct / stats.total) * 100),
        }));
    }, [questions, userAnswers]);

    const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
      return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    };

    const getDifficultyColor = (difficulty: DifficultyLevel): string => {
      switch (difficulty) {
        case 'easy':
          return 'text-accent-600 bg-accent-100';
        case 'medium':
          return 'text-warning-600 bg-warning-100';
        case 'hard':
          return 'text-error-600 bg-error-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Pass/Fail Indicator */}
        <div className={`text-center mb-8 ${passed ? 'animate-fade-in' : ''}`}>
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              passed ? 'bg-accent-100' : 'bg-warning-100'
            }`}
          >
            {passed ? (
              <svg className="w-16 h-16 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-warning-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <h1
            className={`text-4xl font-bold mb-2 ${
              passed ? 'text-accent-900' : 'text-warning-900'
            }`}
          >
            {passed ? 'Great Job!' : 'Keep Practicing!'}
          </h1>
          <p className="text-xl text-gray-600">
            {passed
              ? 'You have a strong understanding of this material.'
              : `You need ${passingScore}% to pass. Keep studying and try again!`}
          </p>
        </div>

        {/* Score Card */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your Score</p>
              <p className="text-5xl font-bold text-gray-900 mb-1">
                {score}
                <span className="text-2xl text-gray-500">/{totalQuestions}</span>
              </p>
              <p
                className={`text-2xl font-semibold ${
                  passed ? 'text-accent-600' : 'text-warning-600'
                }`}
              >
                {percentage}%
              </p>
            </div>

            {/* Passing Score */}
            <div className="text-center border-l border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Required to Pass</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{passingScore}%</p>
              <p
                className={`text-sm font-medium ${
                  percentage >= passingScore ? 'text-accent-600' : 'text-warning-600'
                }`}
              >
                {percentage >= passingScore
                  ? `+${(percentage - passingScore).toFixed(1)}% above`
                  : `${(passingScore - percentage).toFixed(1)}% below`}
              </p>
            </div>
          </div>
        </Card>

        {/* Difficulty Breakdown */}
        {difficultyBreakdown.length > 0 && (
          <Card padding="lg" className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance by Difficulty</h2>
            <div className="space-y-4">
              {difficultyBreakdown.map((item) => (
                <div key={item.difficulty}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                          item.difficulty
                        )}`}
                      >
                        {getDifficultyLabel(item.difficulty)}
                      </span>
                      <p className="text-sm text-gray-600">
                        {item.correct} / {item.total} correct
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        item.accuracy >= 80
                          ? 'text-accent-600'
                          : item.accuracy >= 60
                          ? 'text-warning-600'
                          : 'text-error-600'
                      }`}
                    >
                      {item.accuracy}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.accuracy >= 80
                          ? 'bg-accent-500'
                          : item.accuracy >= 60
                          ? 'bg-warning-500'
                          : 'bg-error-500'
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <Card padding="lg" className="mb-6 bg-primary-50 border-primary-200">
          <div className="flex gap-3">
            <svg
              className="h-6 w-6 text-primary-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {passed ? 'Next Steps' : 'How to Improve'}
              </h3>
              <ul className="text-sm text-primary-800 space-y-1">
                {passed ? (
                  <>
                    <li>Continue practicing to reinforce your knowledge</li>
                    <li>Try a full mock exam to test under exam conditions</li>
                    <li>Review areas where you scored below 80%</li>
                  </>
                ) : (
                  <>
                    <li>Review the explanations for questions you got wrong</li>
                    <li>Focus on areas where your accuracy is below 60%</li>
                    <li>Practice more questions in your weak areas</li>
                    <li>Try the quiz again to track your improvement</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onRetry}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onDashboard}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Celebration Animation */}
        {passed && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-8xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    );
  }
);

QuizResultsScreen.displayName = 'QuizResultsScreen';
