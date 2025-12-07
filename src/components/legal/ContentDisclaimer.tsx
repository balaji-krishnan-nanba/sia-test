/**
 * Content Disclaimer Component
 * Brief disclaimer to display on quiz and mock exam pages
 */

import { useState } from 'react';

export function ContentDisclaimer() {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <svg
              className="mr-2 h-5 w-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-sm font-semibold text-yellow-800">
              Educational Content Disclaimer
            </h3>
          </div>
          <p className="text-sm text-yellow-700">
            These practice questions are for educational purposes only and are{' '}
            <strong>not official SIA exam questions</strong>. While we strive
            for accuracy based on current UK legislation and SIA specifications,
            we recommend verifying information with official sources.
          </p>
          <p className="mt-2 text-sm text-yellow-700">
            Successful completion of practice questions does not guarantee exam
            success. SIA Exam Prep is not affiliated with or endorsed by the
            Security Industry Authority.
          </p>
          <p className="mt-2 text-xs text-yellow-600">
            <strong>Always consult official SIA resources at:</strong>{' '}
            <a
              href="https://www.gov.uk/sia"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-800"
            >
              https://www.gov.uk/sia
            </a>
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-yellow-600 hover:text-yellow-800"
          aria-label="Dismiss disclaimer"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Compact Content Disclaimer
 * Minimal version for footers or less prominent areas
 */
export function CompactContentDisclaimer() {
  return (
    <div className="text-xs text-gray-500">
      <p>
        <strong>Disclaimer:</strong> Practice questions for educational
        purposes only. Not official SIA content. SIA Exam Prep is not
        affiliated with the Security Industry Authority.
      </p>
    </div>
  );
}
