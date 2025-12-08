/**
 * Mock Test List Page - Shows exam-paper-based mock tests matching real SIA exams
 *
 * Features:
 * - Display exam papers matching official SIA structure
 * - Syllabus preview modal before starting
 * - Progress tracking for each exam paper
 * - Seeded question generation for consistency
 *
 * Real exam structures:
 * - Door Supervisor: 2 exams (Exam 1: Units 1&3, Exam 2: Unit 2)
 * - Security Guard: 2 exams (Exam 1: Units 1&3, Exam 2: Unit 2)
 * - CCTV Operator: 2 exams (Exam 1: Unit 1, Exam 2: Unit 2)
 * - Close Protection: 4 exams (Unit 1, Unit 2, Unit 3, Unit 7)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EXAM_DETAILS, type ExamSlug, type ExamPaperSpec } from '@/utils/constants';
import { getMockTestResult, getMockTestStats, type MockTestResult } from '@/utils/mockTestProgress';

interface ExamPaperCardData {
  examNumber: number;
  examPaper: ExamPaperSpec;
  status: 'not-attempted' | 'attempted';
  result?: MockTestResult | null;
}

export function MockTestListPage() {
  const { examSlug } = useParams<{ examSlug: ExamSlug }>();
  const navigate = useNavigate();

  const [examPapers, setExamPapers] = useState<ExamPaperCardData[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamPaperCardData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    notAttempted: 0,
    passed: 0,
    failed: 0,
    averageScore: 0,
  });

  // Validate exam slug
  const examInfo = examSlug ? EXAM_DETAILS[examSlug] : null;

  useEffect(() => {
    if (!examSlug || !examInfo) {
      navigate('/');
      return;
    }

    // Load exam paper results from localStorage
    const papers: ExamPaperCardData[] = examInfo.examPapers.map((paper) => {
      const result = getMockTestResult(examSlug, paper.examNumber);
      return {
        examNumber: paper.examNumber,
        examPaper: paper,
        status: result ? 'attempted' : 'not-attempted',
        result,
      };
    });

    setExamPapers(papers);

    // Load statistics
    const examStats = getMockTestStats(examSlug);
    setStats({
      ...examStats,
      notAttempted: papers.filter((p) => p.status === 'not-attempted').length,
    });
  }, [examSlug, examInfo, navigate]);

  if (!examSlug || !examInfo) {
    return null;
  }

  const handleExamClick = (paper: ExamPaperCardData) => {
    setSelectedExam(paper);
    setShowPreview(true);
  };

  const handleStartTest = () => {
    if (selectedExam) {
      navigate(`/exam/${examSlug}/mock/${selectedExam.examNumber}`);
    }
  };

  const handleBackToExam = () => {
    navigate(`/exam/${examSlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToExam}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Back to Exam
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">{examInfo.name} Exam Papers</h1>
          <p className="text-gray-600 mt-2">
            Complete all {examInfo.examPapers.length} exam papers to be fully prepared for your qualification.
            These match the official SIA exam structure.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.notAttempted}</p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-600">{stats.passed}</p>
              <p className="text-sm text-gray-600">Passed</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-error-600">{stats.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{stats.averageScore}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </Card>
        </div>

        {/* Exam Papers Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {examPapers.map((paper) => (
            <Card key={paper.examNumber} padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Exam {paper.examNumber}
                  </h3>
                  <p className="text-md font-medium text-primary-600 mt-1">
                    {paper.examPaper.examName}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {paper.examPaper.questions} questions • {paper.examPaper.timeMinutes} minutes • {paper.examPaper.passingScore}% to pass
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Unit{paper.examPaper.unitsCovered.length > 1 ? 's' : ''}: {paper.examPaper.unitsCovered.join(' & ')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {paper.status === 'attempted' ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-100">
                      <svg className="w-5 h-5 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Exam Result */}
              {paper.result ? (
                <div className="mb-4">
                  <div className={`p-3 rounded-lg ${paper.result.passed ? 'bg-accent-50 border border-accent-200' : 'bg-warning-50 border border-warning-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Last Score</span>
                      <span className={`text-lg font-bold ${paper.result.passed ? 'text-accent-600' : 'text-warning-600'}`}>
                        {paper.result.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{paper.result.score}/{paper.result.totalQuestions} correct</span>
                      <span className={paper.result.passed ? 'text-accent-600 font-semibold' : 'text-warning-600 font-semibold'}>
                        {paper.result.passed ? 'PASSED' : 'NOT PASSED'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(paper.result.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600 text-center">Not attempted yet</p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                variant={paper.status === 'attempted' ? 'secondary' : 'primary'}
                size="md"
                fullWidth
                onClick={() => handleExamClick(paper)}
              >
                {paper.status === 'attempted' ? 'Retake Exam' : 'Start Exam'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Exam Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={selectedExam ? `Exam ${selectedExam.examNumber} - ${selectedExam.examPaper.examName}` : ''}
          size="lg"
        >
          {selectedExam && (
            <div className="space-y-6">
              {/* Exam Paper Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exam Paper Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Questions</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedExam.examPaper.questions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Limit</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedExam.examPaper.timeMinutes} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passing Score</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedExam.examPaper.passingScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Units Covered</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedExam.examPaper.unitsCovered.join(' & ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pass Mark Calculation */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Pass Requirements</h4>
                <p className="text-sm text-gray-700">
                  You need to answer at least{' '}
                  <span className="font-bold text-primary-600">
                    {Math.ceil(selectedExam.examPaper.questions * selectedExam.examPaper.passingScore / 100)}
                  </span>{' '}
                  out of {selectedExam.examPaper.questions} questions correctly ({selectedExam.examPaper.passingScore}%) to pass this exam paper.
                </p>
                {selectedExam.examPaper.passingScore === 80 && (
                  <p className="text-sm text-warning-600 mt-2 font-medium">
                    Note: This exam paper has an elevated 80% pass mark due to critical safety content.
                  </p>
                )}
              </div>

              {/* Important Notes */}
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Important Notes
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>This exam paper matches the official SIA exam structure</li>
                  <li>Questions are drawn from the units covered by this paper</li>
                  <li>You can navigate between questions and change answers before submitting</li>
                  <li>The exam will auto-submit when time expires</li>
                  <li>You can retake this exam as many times as you want</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => setShowPreview(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleStartTest}
                >
                  Start Exam {selectedExam.examNumber}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
