/**
 * Register Page - User Registration with Google OAuth
 */

import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

export function RegisterPage() {
  const { user, loading: authLoading, signInWithGoogle, isConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect if already logged in
  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSignUp = async () => {
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    if (!isConfigured) {
      setError('Supabase is not configured. Please follow the setup guide in GOOGLE_SSO_SETUP.md');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up. Please try again.';
      setError(errorMessage);
      console.error('Sign up error:', err);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Benefits */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary via-primary-600 to-secondary p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-4xl font-bold">
            Start Your SIA Journey Today
          </h1>
          <p className="mb-8 text-lg text-white/90">
            Join thousands of security professionals who have passed their SIA exams using our platform.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: '✓',
                title: 'Free to Start',
                description: 'Access practice questions immediately with no payment required.',
              },
              {
                icon: '✓',
                title: '2,139+ Questions',
                description: 'Comprehensive question bank covering all 4 SIA qualifications.',
              },
              {
                icon: '✓',
                title: 'Track Your Progress',
                description: 'Detailed analytics to help you focus on weak areas.',
              },
              {
                icon: '✓',
                title: 'Mock Exams',
                description: 'Realistic timed exams to prepare for the real thing.',
              },
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-white/80">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🎓</span>
              <span className="text-2xl font-bold text-primary">SIA Exam Prep</span>
            </Link>
          </div>

          <Card padding="lg" className="shadow-elevated">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
              <p className="mt-2 text-gray-600">
                Start preparing for your SIA exam today
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md bg-error/10 p-4 text-sm text-error">
                {error}
              </div>
            )}

            {/* Setup Warning if not configured */}
            {!isConfigured && (
              <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4">
                <p className="mb-2 text-sm text-yellow-800">
                  <strong>⚠️ Setup Required</strong>
                </p>
                <p className="text-sm text-yellow-700">
                  Google Sign-Up requires Supabase configuration.
                  See{' '}
                  <code className="rounded bg-yellow-100 px-1 py-0.5">
                    GOOGLE_SSO_SETUP.md
                  </code>{' '}
                  for step-by-step instructions.
                </p>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked) setError(null);
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            {/* Google Sign Up Button */}
            <Button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Already have account */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="font-medium text-secondary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
