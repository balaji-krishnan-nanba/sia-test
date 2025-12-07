import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function LoginPage() {
  const { user, loading: authLoading, signInWithGoogle, isConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      setError('Supabase is not configured. Please follow the setup guide in GOOGLE_SSO_SETUP.md');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in. Please try again.';
      setError(errorMessage);
      console.error('Sign in error:', err);
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg bg-white p-8 shadow-card">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">
              Welcome to SIA Exam Prep
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to continue your preparation
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
            <div className="mb-6 rounded-md bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ Setup Required</strong>
              </p>
              <p className="text-sm text-yellow-700">
                Google Sign-In requires Supabase configuration.
                See{' '}
                <code className="rounded bg-yellow-100 px-1 py-0.5">
                  GOOGLE_SSO_SETUP.md
                </code>{' '}
                for step-by-step instructions (takes 10 minutes).
              </p>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="secondary"
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

            {/* Setup Guide */}
            {isConfigured && (
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>✅ Supabase is configured!</strong> You can now sign in with Google.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
