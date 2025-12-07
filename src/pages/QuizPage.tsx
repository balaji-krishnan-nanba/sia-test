/**
 * Quiz Page - Practice quiz with random questions
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadExamQuestions } from '@/lib/questionLoader';
import { shuffleQuestions } from '@/utils/questionRandomizer';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useAuth } from '@/contexts/AuthContext';
import type { Question } from '@/types/question';
import { QuestionCard, ProgressBar, QuizResultsScreen } from '@/components/quiz';
import { Button, Spinner, Card } from '@/components/ui';
import { saveQuestionAttempt } from '@/utils/progressTracker';

/**
 * Transform Question to match QuestionCard format
 */
function transformQuestionForCard(question: Question) {
  return {
    id: question.id,
    question: question.questionText,
    options: {
      A: question.options.find((opt) => opt.id === 'A')?.text || '',
      B: question.options.find((opt) => opt.id === 'B')?.text || '',
      C: question.options.find((opt) => opt.id === 'C')?.text || '',
      D: question.options.find((opt) => opt.id === 'D')?.text || '',
    },
    correctAnswer: question.options.find((opt) => opt.isCorrect)?.id || 'A',
    explanation: question.explanation || 'No explanation available.',
    difficulty: question.difficulty,
    unitTitle: question.unitId,
    chapterTitle: question.chapterId,
  };
}

export function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isConfigured } = useAuth();

  // Get exam type from URL params
  const examSlug = searchParams.get('exam') || 'door-supervisor';
  const questionCount = parseInt(searchParams.get('count') || '20', 10);
  const unitFilter = searchParams.get('unit'); // e.g., "U1"
  const chapterFilter = searchParams.get('chapter'); // e.g., "1.1"

  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Quiz session hook - include unit/chapter in session key for separate tracking
  const sessionKey = `quiz-${examSlug}${unitFilter ? `-${unitFilter}` : ''}${chapterFilter ? `-${chapterFilter}` : ''}`;
  const quiz = useQuizSession(questions, {
    saveProgress: true,
    autoSave: true,
    sessionKey,
  });

  // Load questions on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        console.log(`[QuizPage] Starting to load questions for exam: ${examSlug}, count: ${questionCount}`);
        setLoading(true);
        setError(null);

        // Load all questions for the exam
        const allQuestions = await loadExamQuestions(
          examSlug as 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection'
        );

        console.log(`[QuizPage] Loaded ${allQuestions.length} total questions`);

        if (allQuestions.length === 0) {
          throw new Error('No questions found for this exam');
        }

        // Filter by unit and/or chapter if specified
        let filteredQuestions = allQuestions;

        if (unitFilter) {
          filteredQuestions = filteredQuestions.filter((q) => q.unitId === unitFilter);
          console.log(`[QuizPage] Filtered to ${filteredQuestions.length} questions for unit ${unitFilter}`);
        }

        if (chapterFilter) {
          filteredQuestions = filteredQuestions.filter((q) => q.chapterId === chapterFilter);
          console.log(`[QuizPage] Filtered to ${filteredQuestions.length} questions for chapter ${chapterFilter}`);
        }

        if (filteredQuestions.length === 0) {
          throw new Error('No questions found for the selected unit/chapter');
        }

        // Shuffle and select random questions
        const shuffled = shuffleQuestions(filteredQuestions);
        const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

        console.log(`[QuizPage] Selected ${selected.length} questions for quiz`);
        setQuestions(selected);
        console.log(`[QuizPage] Questions state updated successfully`);
      } catch (err) {
        console.error('[QuizPage] Error loading questions:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load questions. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [examSlug, questionCount, unitFilter, chapterFilter]);

  // Debug logging for current question state (moved here to comply with Rules of Hooks)
  useEffect(() => {
    console.log(`[QuizPage] Current question updated:`, {
      hasQuestion: !!quiz.currentQuestion,
      questionId: quiz.currentQuestion?.id,
      totalQuestions: quiz.totalQuestions,
      currentIndex: quiz.currentIndex,
    });
  }, [quiz.currentQuestion, quiz.totalQuestions, quiz.currentIndex]);

  // Handle answer selection
  const handleAnswerSelect = useCallback(
    (answerId: string) => {
      if (!hasCheckedAnswer) {
        quiz.selectAnswer(answerId);
      }
    },
    [hasCheckedAnswer, quiz]
  );

  // Handle check answer
  const handleCheckAnswer = useCallback(async () => {
    if (!quiz.currentQuestion || !quiz.currentQuestion.userAnswer) {
      return;
    }

    setHasCheckedAnswer(true);

    // Save progress to Supabase if user is logged in and Supabase is configured
    if (user && isConfigured && quiz.currentQuestion.userAnswer) {
      try {
        await saveQuestionAttempt(user.id, {
          questionId: quiz.currentQuestion.id,
          unitId: quiz.currentQuestion.unitId,
          chapterId: quiz.currentQuestion.chapterId,
          difficulty: quiz.currentQuestion.difficulty,
          userAnswer: quiz.currentQuestion.userAnswer,
          correctAnswer: quiz.currentQuestion.options.find((opt) => opt.isCorrect)?.id || '',
          isCorrect: quiz.currentQuestion.isCorrect || false,
          timeSpent: quiz.currentQuestion.timeSpent || 0,
          attemptedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error saving question attempt:', error);
        // Don't show error to user - this is non-critical
      }
    }
  }, [quiz.currentQuestion, user, isConfigured]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    setHasCheckedAnswer(false);
    quiz.nextQuestion();
  }, [quiz]);

  // Handle previous question
  const handlePreviousQuestion = useCallback(() => {
    const previousQuestion = quiz.getQuestionAtIndex(quiz.currentIndex - 1);
    const wasAnswered = previousQuestion?.userAnswer !== null && previousQuestion?.userAnswer !== undefined;
    setHasCheckedAnswer(wasAnswered);
    quiz.previousQuestion();
  }, [quiz]);

  // Handle finish quiz
  const handleFinishQuiz = useCallback(() => {
    quiz.submitQuiz();
    setShowResults(true);
  }, [quiz]);

  // Handle retry quiz
  const handleRetryQuiz = useCallback(() => {
    quiz.resetQuiz();
    setHasCheckedAnswer(false);
    setShowResults(false);
  }, [quiz]);

  // Handle go back to exam
  const handleGoBack = useCallback(() => {
    const exam = searchParams.get('exam');
    navigate(exam ? `/exam/${exam}` : '/');
  }, [navigate, searchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-error-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            There are no questions available for this quiz. Please try a different exam or contact
            support.
          </p>
          <Button variant="primary" onClick={handleGoBack}>
            Back to Exam
          </Button>
        </Card>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <QuizResultsScreen
          score={quiz.correctCount}
          totalQuestions={quiz.totalQuestions}
          questions={quiz.getQuestionAtIndex(0) ? questions : []}
          userAnswers={questions.map((_, index) => {
            const q = quiz.getQuestionAtIndex(index);
            return {
              questionId: q?.id || '',
              userAnswer: q?.userAnswer || null,
              isCorrect: q?.isCorrect || false,
            };
          })}
          onRetry={handleRetryQuiz}
          onDashboard={handleGoBack}
        />
      </div>
    );
  }

  // Current question
  const currentQuestion = quiz.currentQuestion;

  if (!currentQuestion) {
    console.warn('[QuizPage] No current question available - showing fallback message');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No question available</p>
      </div>
    );
  }

  const transformedQuestion = transformQuestionForCard(currentQuestion);
  const isAnswered = currentQuestion.userAnswer !== null && currentQuestion.userAnswer !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Practice Quiz</h1>
              <p className="text-gray-600 mt-1">
                {examSlug
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}{' '}
                Exam
                {unitFilter && (
                  <span className="ml-2">
                    - {unitFilter}
                    {chapterFilter && <span> / Chapter {chapterFilter}</span>}
                  </span>
                )}
              </p>
            </div>
            <Button variant="ghost" onClick={handleGoBack}>
              Exit Quiz
            </Button>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            current={quiz.currentIndex + 1}
            total={quiz.totalQuestions}
            correct={quiz.correctCount}
            incorrect={quiz.answeredCount - quiz.correctCount}
          />
        </div>

        {/* Question Card */}
        <QuestionCard
          questionNumber={quiz.currentIndex + 1}
          totalQuestions={quiz.totalQuestions}
          question={transformedQuestion}
          selectedAnswer={currentQuestion.userAnswer || null}
          onAnswerSelect={handleAnswerSelect}
          showResult={hasCheckedAnswer}
          isCorrect={currentQuestion.isCorrect || false}
          isBookmarked={currentQuestion.flaggedForReview}
          onBookmarkToggle={quiz.toggleFlag}
          disabled={hasCheckedAnswer}
        />

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handlePreviousQuestion}
            disabled={quiz.isFirstQuestion}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            }
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {!hasCheckedAnswer && isAnswered && (
              <Button variant="primary" onClick={handleCheckAnswer}>
                Check Answer
              </Button>
            )}

            {hasCheckedAnswer && !quiz.isLastQuestion && (
              <Button variant="primary" onClick={handleNextQuestion}>
                Next Question
              </Button>
            )}

            {hasCheckedAnswer && quiz.isLastQuestion && (
              <Button variant="success" onClick={handleFinishQuiz}>
                Finish Quiz
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={handleNextQuestion}
            disabled={quiz.isLastQuestion || !hasCheckedAnswer}
            rightIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Next
          </Button>
        </div>

        {/* Quiz Status */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {quiz.answeredCount} of {quiz.totalQuestions} questions answered
            {quiz.answeredCount > 0 && (
              <span className="ml-2">
                ({quiz.correctCount} correct, {quiz.answeredCount - quiz.correctCount} incorrect)
              </span>
            )}
          </p>
          {quiz.flaggedCount > 0 && (
            <p className="mt-1">
              {quiz.flaggedCount} question{quiz.flaggedCount > 1 ? 's' : ''} bookmarked for review
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
