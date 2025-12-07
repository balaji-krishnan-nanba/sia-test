/**
 * Mock Exam Page - Complete examination experience for SIA Door Supervisor
 *
 * Features:
 * - Pre-exam instructions screen
 * - 50 questions with 90-minute timer
 * - Question navigator with status indicators
 * - Flag for review functionality
 * - Submit confirmation
 * - Detailed results breakdown
 * - Review mode to see all answers
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { generateMockExam } from '@/utils/questionRandomizer';
import { saveMockExamResult } from '@/utils/progressTracker';
import { generateMockTestSeed } from '@/utils/seededRandom';
import { saveMockTestResult } from '@/utils/mockTestProgress';
import { Timer } from '@/components/mock-exam/Timer';
import { ResultsScreen, UnitBreakdown } from '@/components/mock-exam/ResultsScreen';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuestionNavigator, QuestionStatus } from '@/components/quiz/QuestionNavigator';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { Question, SIAQualification } from '@/types/question';

// Exam constants
const TOTAL_QUESTIONS = 50;
const TIME_LIMIT_SECONDS = 90 * 60; // 90 minutes
const PASSING_SCORE = 70; // 70% to pass

type ExamState = 'pre-exam' | 'in-progress' | 'completed' | 'review';

interface ExamAnswer {
  questionId: string;
  selectedAnswer: string | null;
  timeSpent: number;
  flagged: boolean;
}

// Exam name mappings
const EXAM_NAMES: Record<string, string> = {
  'door-supervisor': 'Door Supervisor',
  'security-guard': 'Security Guard',
  'cctv-operator': 'CCTV Operator',
  'close-protection': 'Close Protection',
};

// Qualification codes for database
const EXAM_CODES: Record<string, string> = {
  'door-supervisor': 'DS',
  'security-guard': 'SG',
  'cctv-operator': 'CCTV',
  'close-protection': 'CP',
};

export function MockExamPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams<{ examSlug?: string; testNumber?: string }>();
  const { user } = useAuth();

  // Get exam type from URL params (supports both old and new route patterns)
  // New pattern: /exam/:examSlug/mock/:testNumber
  // Old pattern: /mock-exam?exam=door-supervisor
  const examSlug = params.examSlug || searchParams.get('exam') || 'door-supervisor';
  const testNumberStr = params.testNumber || searchParams.get('testNumber');
  const testNumber = testNumberStr ? parseInt(testNumberStr, 10) : null;

  const examName = EXAM_NAMES[examSlug] || 'Door Supervisor';
  const examCode = EXAM_CODES[examSlug] || 'DS';

  // Exam state
  const [examState, setExamState] = useState<ExamState>('pre-exam');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Questions and answers
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<string, ExamAnswer>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  // Timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [_timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_SECONDS);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Modals
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showExitWarning, _setShowExitWarning] = useState(false);

  // Results
  const [examResults, setExamResults] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    timeUsed: number;
    unitBreakdown: UnitBreakdown[];
  } | null>(null);

  // Load last attempt from localStorage
  const [lastAttempt, setLastAttempt] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    date: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastMockExamAttempt');
    if (stored) {
      try {
        setLastAttempt(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing last attempt:', e);
      }
    }
  }, []);

  // Generate exam questions
  const startExam = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate seed if this is a numbered mock test
      const seed = testNumber
        ? generateMockTestSeed(examSlug, testNumber)
        : undefined;

      const examQuestions = await generateMockExam(
        examSlug as 'door-supervisor' | 'security-guard' | 'cctv-operator' | 'close-protection',
        TOTAL_QUESTIONS,
        {
          shuffleAnswers: true,
          ensureBalancedUnits: true,
          seed, // Use seed for reproducible questions
        }
      );

      if (examQuestions.length < TOTAL_QUESTIONS) {
        throw new Error(`Not enough questions available. Expected ${TOTAL_QUESTIONS}, got ${examQuestions.length}`);
      }

      setQuestions(examQuestions);

      // Initialize answers map
      const initialAnswers = new Map<string, ExamAnswer>();
      examQuestions.forEach(q => {
        initialAnswers.set(q.id, {
          questionId: q.id,
          selectedAnswer: null,
          timeSpent: 0,
          flagged: false,
        });
      });
      setAnswers(initialAnswers);

      setExamState('in-progress');
      setIsTimerRunning(true);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Error starting exam:', err);
      setError(err instanceof Error ? err.message : 'Failed to start exam. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [examSlug, testNumber]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerId: string) => {
    if (examState !== 'in-progress') return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const currentAnswer = answers.get(currentQuestion.id);

    if (currentAnswer) {
      setAnswers(new Map(answers.set(currentQuestion.id, {
        ...currentAnswer,
        selectedAnswer: answerId,
      })));
    }
  }, [examState, questions, currentQuestionIndex, answers]);

  // Toggle flag for current question
  const toggleFlag = useCallback(() => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex);
    } else {
      newFlagged.add(currentQuestionIndex);
    }
    setFlaggedQuestions(newFlagged);

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const currentAnswer = answers.get(currentQuestion.id);
    if (currentAnswer) {
      setAnswers(new Map(answers.set(currentQuestion.id, {
        ...currentAnswer,
        flagged: !currentAnswer.flagged,
      })));
    }
  }, [currentQuestionIndex, flaggedQuestions, questions, answers]);

  // Navigate to question
  const navigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // Next question
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  // Previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  // Calculate results
  const calculateResults = useCallback(() => {
    let correctCount = 0;
    const unitStats = new Map<string, { total: number; correct: number; title: string }>();

    questions.forEach(question => {
      const answer = answers.get(question.id);
      const correctOption = question.options.find(opt => opt.isCorrect);
      const isCorrect = answer?.selectedAnswer === correctOption?.id;

      if (isCorrect) {
        correctCount++;
      }

      // Track by unit
      const unitId = question.unitId;
      const unitNumber = parseInt(unitId.substring(1));
      const unitKey = `U${unitNumber}`;

      if (!unitStats.has(unitKey)) {
        unitStats.set(unitKey, {
          total: 0,
          correct: 0,
          title: question.questionText.split(':')[0] || `Unit ${unitNumber}`,
        });
      }

      const stats = unitStats.get(unitKey)!;
      stats.total++;
      if (isCorrect) {
        stats.correct++;
      }
    });

    const percentage = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const passed = percentage >= PASSING_SCORE;
    const timeUsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // Build unit breakdown
    const unitBreakdown: UnitBreakdown[] = Array.from(unitStats.entries())
      .map(([unitKey, stats]) => ({
        unitNumber: parseInt(unitKey.substring(1)),
        unitTitle: stats.title,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        accuracy: Math.round((stats.correct / stats.total) * 100),
      }))
      .sort((a, b) => a.unitNumber - b.unitNumber);

    return {
      score: correctCount,
      percentage,
      passed,
      timeUsed,
      unitBreakdown,
    };
  }, [questions, answers, startTime]);

  // Submit exam
  const submitExam = useCallback(async () => {
    setShowSubmitConfirm(false);
    setIsTimerRunning(false);

    const results = calculateResults();
    setExamResults(results);
    setExamState('completed');

    // Save to localStorage (for backward compatibility)
    const attemptData = {
      score: results.score,
      percentage: results.percentage,
      passed: results.passed,
      date: new Date().toISOString(),
    };
    localStorage.setItem('lastMockExamAttempt', JSON.stringify(attemptData));
    setLastAttempt(attemptData);

    // If this is a numbered mock test, save it separately
    if (testNumber && typeof examSlug === 'string') {
      saveMockTestResult({
        testNumber,
        examSlug: examSlug as string,
        score: results.score,
        totalQuestions: TOTAL_QUESTIONS,
        percentage: results.percentage,
        passed: results.passed,
        timeSpent: results.timeUsed,
        completedAt: new Date().toISOString(),
      });
    }

    // Save to database if user is logged in
    if (user) {
      try {
        const questionsData = questions.map(q => {
          const answer = answers.get(q.id);
          const correctOption = q.options.find(opt => opt.isCorrect);
          const isCorrect = answer?.selectedAnswer === correctOption?.id;

          return {
            questionId: q.id,
            userAnswer: answer?.selectedAnswer || null,
            isCorrect: isCorrect || false,
          };
        });

        await saveMockExamResult(user.id, {
          qualification: examCode as SIAQualification,
          score: results.percentage,
          passingScore: PASSING_SCORE,
          totalQuestions: TOTAL_QUESTIONS,
          correctAnswers: results.score,
          timeSpent: results.timeUsed,
          questions: questionsData,
        });
      } catch (err) {
        console.error('Error saving exam result:', err);
        // Don't block user from seeing results
      }
    }
  }, [calculateResults, user, questions, answers, examCode]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    submitExam();
  }, [submitExam]);

  // Review answers
  const reviewAnswers = useCallback(() => {
    setExamState('review');
    setCurrentQuestionIndex(0);
  }, []);

  // Retake exam
  const retakeExam = useCallback(() => {
    setExamState('pre-exam');
    setQuestions([]);
    setAnswers(new Map());
    setCurrentQuestionIndex(0);
    setFlaggedQuestions(new Set());
    setTimeRemaining(TIME_LIMIT_SECONDS);
    setStartTime(null);
    setExamResults(null);
  }, []);

  // Back to mock test list
  const backToMockList = useCallback(() => {
    navigate(`/exam/${examSlug}/mock`);
  }, [navigate, examSlug]);

  // Get question navigator status
  const getQuestionStatuses = useCallback((): QuestionStatus[] => {
    return questions.map((q, index) => {
      const answer = answers.get(q.id);
      const correctOption = q.options.find(opt => opt.isCorrect);
      const isCorrect = examState === 'review' || examState === 'completed'
        ? answer?.selectedAnswer === correctOption?.id
        : undefined;

      return {
        answered: answer?.selectedAnswer !== null && answer?.selectedAnswer !== undefined,
        flagged: flaggedQuestions.has(index),
        correct: isCorrect,
      };
    });
  }, [questions, answers, flaggedQuestions, examState]);

  // Current question data
  const currentQuestion = useMemo(() => {
    if (questions.length === 0) return null;
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return null;
    return answers.get(currentQuestion.id);
  }, [currentQuestion, answers]);

  // Stats for submit confirmation
  const examStats = useMemo(() => {
    const answered = Array.from(answers.values()).filter(a => a.selectedAnswer !== null).length;
    const unanswered = TOTAL_QUESTIONS - answered;
    const flagged = flaggedQuestions.size;
    return { answered, unanswered, flagged };
  }, [answers, flaggedQuestions]);

  // Prevent accidental navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examState === 'in-progress') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examState]);

  // PRE-EXAM SCREEN
  if (examState === 'pre-exam') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card padding="lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {examName} {testNumber ? `Mock Test ${testNumber}` : 'Mock Exam'}
            </h1>
            <p className="text-lg text-gray-600">
              {testNumber
                ? `Complete this practice test to assess your knowledge`
                : 'Test your knowledge with a full practice exam'}
            </p>
          </div>

          {/* Last Attempt */}
          {lastAttempt && (
            <div className={`mb-6 p-4 rounded-lg ${lastAttempt.passed ? 'bg-accent-50 border border-accent-200' : 'bg-warning-50 border border-warning-200'}`}>
              <h3 className="font-semibold text-gray-900 mb-2">Last Attempt</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Score: <span className="font-semibold">{lastAttempt.score}/{TOTAL_QUESTIONS}</span> ({lastAttempt.percentage}%)
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(lastAttempt.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-lg font-bold ${lastAttempt.passed ? 'text-accent-600' : 'text-warning-600'}`}>
                  {lastAttempt.passed ? 'PASSED' : 'NOT PASSED'}
                </div>
              </div>
            </div>
          )}

          {/* Exam Details */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl font-bold text-gray-900">{TOTAL_QUESTIONS}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl font-bold text-gray-900">90</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl font-bold text-gray-900">{PASSING_SCORE}%</p>
              <p className="text-sm text-gray-600">To Pass</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Answer all 50 multiple-choice questions</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>You have 90 minutes to complete the exam</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>You can navigate between questions and change answers anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Flag questions for review if you're unsure</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No feedback will be shown until you submit the exam</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>The exam will auto-submit when time expires</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Tips for Success
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Read each question carefully before answering</li>
              <li>Manage your time - aim for about 1-2 minutes per question</li>
              <li>Answer all questions, even if you're unsure (no negative marking)</li>
              <li>Use the flag feature to mark questions you want to review</li>
              <li>Review all flagged questions before submitting</li>
            </ul>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-700">{error}</p>
            </div>
          )}

          {/* Start Button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={startExam}
              loading={loading}
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? 'Loading Exam...' : 'Start Exam'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // RESULTS SCREEN
  if (examState === 'completed' && examResults) {
    return (
      <ResultsScreen
        score={examResults.score}
        totalQuestions={TOTAL_QUESTIONS}
        percentage={examResults.percentage}
        passed={examResults.passed}
        passingScore={PASSING_SCORE}
        timeUsed={examResults.timeUsed}
        timeLimit={TIME_LIMIT_SECONDS}
        unitBreakdown={examResults.unitBreakdown}
        onReviewAnswers={reviewAnswers}
        onRetake={retakeExam}
        onDashboard={backToMockList}
        showCelebration={examResults.passed}
      />
    );
  }

  // EXAM IN PROGRESS OR REVIEW MODE
  if ((examState === 'in-progress' || examState === 'review') && currentQuestion) {
    const isReviewMode = examState === 'review';
    const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
    const isCurrentCorrect = currentAnswer?.selectedAnswer === correctOption?.id;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Timer */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Timer */}
              <div className="flex-shrink-0">
                {examState === 'in-progress' && (
                  <Timer
                    duration={TIME_LIMIT_SECONDS}
                    onTimeUp={handleTimeUp}
                    isRunning={isTimerRunning}
                    showControls={false}
                  />
                )}
                {isReviewMode && (
                  <div className="text-lg font-semibold text-gray-900">
                    Review Mode
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
                </span>

                {/* Desktop Navigator Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNavigator(true)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  }
                >
                  Navigator
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={TOTAL_QUESTIONS}
              question={{
                id: currentQuestion.id,
                question: currentQuestion.questionText,
                options: {
                  A: currentQuestion.options[0]?.text || '',
                  B: currentQuestion.options[1]?.text || '',
                  C: currentQuestion.options[2]?.text || '',
                  D: currentQuestion.options[3]?.text || '',
                },
                correctAnswer: correctOption?.id || 'A',
                explanation: currentQuestion.explanation || '',
                difficulty: currentQuestion.difficulty,
                unitTitle: `Unit ${currentQuestion.unitId}`,
                chapterTitle: currentQuestion.chapterId,
              }}
              selectedAnswer={currentAnswer?.selectedAnswer || null}
              onAnswerSelect={handleAnswerSelect}
              showResult={isReviewMode}
              isCorrect={isCurrentCorrect}
              isBookmarked={flaggedQuestions.has(currentQuestionIndex)}
              onBookmarkToggle={toggleFlag}
              disabled={isReviewMode}
            />

            {/* Navigation Controls */}
            <div className="mt-6 flex items-center justify-between gap-4">
              {/* Previous Button */}
              <Button
                variant="secondary"
                size="md"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                }
              >
                Previous
              </Button>

              {/* Flag Button (only in exam mode) */}
              {!isReviewMode && (
                <Button
                  variant={flaggedQuestions.has(currentQuestionIndex) ? 'danger' : 'ghost'}
                  size="md"
                  onClick={toggleFlag}
                  leftIcon={
                    <svg className="w-5 h-5" fill={flaggedQuestions.has(currentQuestionIndex) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  }
                >
                  {flaggedQuestions.has(currentQuestionIndex) ? 'Flagged' : 'Flag for Review'}
                </Button>
              )}

              {/* Next/Submit Button */}
              {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    if (isReviewMode) {
                      setExamState('completed');
                    } else {
                      setShowSubmitConfirm(true);
                    }
                  }}
                  rightIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  {isReviewMode ? 'Back to Results' : 'Submit Exam'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={nextQuestion}
                  rightIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Modal */}
        <QuestionNavigator
          questions={getQuestionStatuses()}
          currentIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          mode="modal"
          isOpen={showNavigator}
          onClose={() => setShowNavigator(false)}
        />

        {/* Submit Confirmation Modal */}
        <Modal
          isOpen={showSubmitConfirm}
          onClose={() => setShowSubmitConfirm(false)}
          title="Submit Exam"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to submit your exam? You won't be able to change your answers after submission.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Answered:</span>
                <span className="font-semibold text-gray-900">{examStats.answered}/{TOTAL_QUESTIONS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Unanswered:</span>
                <span className="font-semibold text-warning-600">{examStats.unanswered}</span>
              </div>
              {examStats.flagged > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Flagged for Review:</span>
                  <span className="font-semibold text-error-600">{examStats.flagged}</span>
                </div>
              )}
            </div>

            {examStats.unanswered > 0 && (
              <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  You have {examStats.unanswered} unanswered question{examStats.unanswered > 1 ? 's' : ''}.
                  You can still go back and answer them.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setShowSubmitConfirm(false)}
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={submitExam}
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
