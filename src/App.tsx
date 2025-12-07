/**
 * Main App Component with Router
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ROUTES } from '@utils/constants';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Eager load home page for better initial load
import { HomePage } from '@pages/HomePage';

// Lazy load other pages for code splitting
const LoginPage = lazy(() =>
  import('@pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const QuizPage = lazy(() =>
  import('@pages/QuizPage').then((m) => ({ default: m.QuizPage }))
);
const PracticePage = lazy(() =>
  import('@pages/PracticePage').then((m) => ({ default: m.PracticePage }))
);
const MockExamPage = lazy(() =>
  import('@pages/MockExamPage').then((m) => ({ default: m.MockExamPage }))
);
const ExamPage = lazy(() =>
  import('@pages/ExamPage').then((m) => ({ default: m.ExamPage }))
);
const MockTestListPage = lazy(() =>
  import('@pages/MockTestListPage').then((m) => ({ default: m.MockTestListPage }))
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/sia-test">
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Protected Routes - Exam Flow */}
            <Route
              path={ROUTES.EXAM}
              element={
                <ProtectedRoute>
                  <ExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EXAM_PRACTICE}
              element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EXAM_MOCK}
              element={
                <ProtectedRoute>
                  <MockTestListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EXAM_MOCK_TEST}
              element={
                <ProtectedRoute>
                  <MockExamPage />
                </ProtectedRoute>
              }
            />

            {/* Quiz Route - Used by practice flow with query params */}
            <Route
              path={ROUTES.QUIZ}
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
