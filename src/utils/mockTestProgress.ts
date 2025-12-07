/**
 * Mock Test Progress Tracking
 * Manages localStorage for mock test attempts and results
 */

export interface MockTestResult {
  testNumber: number;
  examSlug: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // seconds
  completedAt: string; // ISO date
}

/**
 * Get storage key for a mock test result
 */
function getMockTestKey(examSlug: string, testNumber: number): string {
  return `mock-${examSlug}-test-${testNumber}`;
}

/**
 * Save mock test result to localStorage
 * @param result - Test result to save
 */
export function saveMockTestResult(result: MockTestResult): void {
  try {
    const key = getMockTestKey(result.examSlug, result.testNumber);
    localStorage.setItem(key, JSON.stringify(result));
  } catch (error) {
    console.error('Error saving mock test result:', error);
  }
}

/**
 * Get mock test result from localStorage
 * @param examSlug - Exam identifier
 * @param testNumber - Test number (1-10)
 * @returns Test result or null if not found
 */
export function getMockTestResult(examSlug: string, testNumber: number): MockTestResult | null {
  try {
    const key = getMockTestKey(examSlug, testNumber);
    const stored = localStorage.getItem(key);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading mock test result:', error);
    return null;
  }
}

/**
 * Get all mock test results for an exam
 * @param examSlug - Exam identifier
 * @returns Array of results for tests 1-10
 */
export function getAllMockTestResults(examSlug: string): (MockTestResult | null)[] {
  const results: (MockTestResult | null)[] = [];

  for (let i = 1; i <= 10; i++) {
    results.push(getMockTestResult(examSlug, i));
  }

  return results;
}

/**
 * Get completion statistics for an exam's mock tests
 * @param examSlug - Exam identifier
 * @returns Statistics about completed tests
 */
export function getMockTestStats(examSlug: string): {
  completed: number;
  notAttempted: number;
  passed: number;
  failed: number;
  averageScore: number;
} {
  const results = getAllMockTestResults(examSlug);

  let completed = 0;
  let passed = 0;
  let failed = 0;
  let totalScore = 0;

  results.forEach(result => {
    if (result) {
      completed++;
      totalScore += result.percentage;

      if (result.passed) {
        passed++;
      } else {
        failed++;
      }
    }
  });

  return {
    completed,
    notAttempted: 10 - completed,
    passed,
    failed,
    averageScore: completed > 0 ? Math.round(totalScore / completed) : 0,
  };
}

/**
 * Clear all mock test results for an exam
 * @param examSlug - Exam identifier
 */
export function clearMockTestResults(examSlug: string): void {
  try {
    for (let i = 1; i <= 10; i++) {
      const key = getMockTestKey(examSlug, i);
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error clearing mock test results:', error);
  }
}
