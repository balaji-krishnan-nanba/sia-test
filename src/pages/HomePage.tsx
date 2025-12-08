/**
 * Home/Landing Page - Simple and focused on exam selection
 */

import { Link } from 'react-router-dom';
import { EXAM_DETAILS, type ExamSlug } from '@utils/constants';
import { Card } from '@/components/ui/Card';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <h1 className="text-2xl font-bold text-gray-900">SIA Exam Prep</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">
              Choose Your SIA Qualification
            </h2>
            <p className="text-lg text-gray-600">
              Select an exam to view details and start practicing
            </p>
          </div>

          {/* Exam Cards Grid */}
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {(Object.keys(EXAM_DETAILS) as ExamSlug[]).map((slug) => {
              const exam = EXAM_DETAILS[slug];
              return (
                <Link
                  key={slug}
                  to={`/exam/${slug}`}
                  className="block transition-transform hover:scale-105"
                >
                  <Card hoverable className="h-full">
                    <div className="p-6">
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">
                        {exam.name}
                      </h3>
                      <p className="mb-4 text-gray-600">{exam.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">
                          {exam.totalMcqQuestions} questions
                        </span>
                        <span>•</span>
                        <span>{exam.totalTimeMinutes} minutes</span>
                        <span>•</span>
                        <span>70% to pass</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} SIA Exam Prep. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
