/**
 * Mock Test List Page - Shows 10 pre-defined mock tests for an exam
 *
 * Features:
 * - Display 10 mock tests with completion status
 * - Syllabus preview modal before starting
 * - Progress tracking for each test
 * - Seeded question generation for consistency
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EXAM_DETAILS, type ExamSlug } from '@/utils/constants';
import { getMockTestResult, getMockTestStats, type MockTestResult } from '@/utils/mockTestProgress';

interface MockTestCardData {
  testNumber: number;
  status: 'not-attempted' | 'attempted';
  result?: MockTestResult | null;
}

// Unit distribution for each exam type (approximate percentages)
const UNIT_DISTRIBUTIONS: Record<ExamSlug, { unitNumber: number; title: string; percentage: number }[]> = {
  'door-supervisor': [
    { unitNumber: 1, title: 'Working in the Private Security Industry', percentage: 30 },
    { unitNumber: 2, title: 'Working as a Door Supervisor', percentage: 30 },
    { unitNumber: 3, title: 'Health and Safety', percentage: 20 },
    { unitNumber: 4, title: 'Emergency Procedures', percentage: 20 },
  ],
  'security-guard': [
    { unitNumber: 1, title: 'Working in the Private Security Industry', percentage: 50 },
    { unitNumber: 2, title: 'Working as a Security Officer', percentage: 50 },
  ],
  'cctv-operator': [
    { unitNumber: 1, title: 'Working in the Private Security Industry', percentage: 40 },
    { unitNumber: 2, title: 'CCTV Operations', percentage: 35 },
    { unitNumber: 3, title: 'Legal and Regulatory Framework', percentage: 25 },
  ],
  'close-protection': [
    { unitNumber: 1, title: 'Working in the Private Security Industry', percentage: 15 },
    { unitNumber: 2, title: 'Close Protection Operations', percentage: 20 },
    { unitNumber: 3, title: 'Threat Assessment', percentage: 15 },
    { unitNumber: 4, title: 'Route Planning', percentage: 15 },
    { unitNumber: 5, title: 'Surveillance Awareness', percentage: 15 },
    { unitNumber: 6, title: 'Conflict Management', percentage: 10 },
    { unitNumber: 7, title: 'Emergency Procedures', percentage: 10 },
  ],
};

export function MockTestListPage() {
  const { examSlug } = useParams<{ examSlug: ExamSlug }>();
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState<MockTestCardData[]>([]);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    notAttempted: 10,
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

    // Load mock test results from localStorage
    const tests: MockTestCardData[] = [];
    for (let i = 1; i <= 10; i++) {
      const result = getMockTestResult(examSlug, i);
      tests.push({
        testNumber: i,
        status: result ? 'attempted' : 'not-attempted',
        result,
      });
    }

    setMockTests(tests);

    // Load statistics
    const examStats = getMockTestStats(examSlug);
    setStats(examStats);
  }, [examSlug, examInfo, navigate]);

  if (!examSlug || !examInfo) {
    return null;
  }

  const unitDistribution = UNIT_DISTRIBUTIONS[examSlug];

  const handleTestClick = (testNumber: number) => {
    setSelectedTest(testNumber);
    setShowPreview(true);
  };

  const handleStartTest = () => {
    if (selectedTest) {
      navigate(`/exam/${examSlug}/mock/${selectedTest}`);
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

          <h1 className="text-3xl font-bold text-gray-900 mt-4">{examInfo.name} Mock Tests</h1>
          <p className="text-gray-600 mt-2">
            Complete all 10 practice tests to be fully prepared for your exam
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

        {/* Mock Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test) => (
            <Card key={test.testNumber} padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Mock Test {test.testNumber}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {examInfo.totalQuestions} questions • {examInfo.timeLimit} minutes
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {test.status === 'attempted' ? (
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

              {/* Test Result */}
              {test.result ? (
                <div className="mb-4">
                  <div className={`p-3 rounded-lg ${test.result.passed ? 'bg-accent-50 border border-accent-200' : 'bg-warning-50 border border-warning-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Last Score</span>
                      <span className={`text-lg font-bold ${test.result.passed ? 'text-accent-600' : 'text-warning-600'}`}>
                        {test.result.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{test.result.score}/{test.result.totalQuestions} correct</span>
                      <span className={test.result.passed ? 'text-accent-600 font-semibold' : 'text-warning-600 font-semibold'}>
                        {test.result.passed ? 'PASSED' : 'NOT PASSED'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(test.result.completedAt).toLocaleDateString()}
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
                variant={test.status === 'attempted' ? 'secondary' : 'primary'}
                size="md"
                fullWidth
                onClick={() => handleTestClick(test.testNumber)}
              >
                {test.status === 'attempted' ? 'Retake Test' : 'Start Test'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Syllabus Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={`Mock Test ${selectedTest} - Syllabus Preview`}
          size="lg"
        >
          {selectedTest && (
            <div className="space-y-6">
              {/* Exam Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exam Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Questions</p>
                      <p className="text-lg font-semibold text-gray-900">{examInfo.totalQuestions}</p>
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
                      <p className="text-lg font-semibold text-gray-900">{examInfo.timeLimit} minutes</p>
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
                      <p className="text-lg font-semibold text-gray-900">{examInfo.passingScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Units</p>
                      <p className="text-lg font-semibold text-gray-900">{examInfo.units}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Question Distribution by Unit</h3>
                <div className="space-y-3">
                  {unitDistribution.map((unit) => {
                    const questionCount = Math.round((examInfo.totalQuestions * unit.percentage) / 100);
                    return (
                      <div key={unit.unitNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Unit {unit.unitNumber}: {unit.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Approximately {questionCount} questions ({unit.percentage}%)
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  <li>This is a full-length practice exam matching the official format</li>
                  <li>Questions are randomly selected but consistent for each test number</li>
                  <li>You can navigate between questions and change answers before submitting</li>
                  <li>The exam will auto-submit when time expires</li>
                  <li>You can retake this test as many times as you want</li>
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
                  Start Test {selectedTest}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
