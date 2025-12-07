import React, { useState } from 'react';
import { Button } from '../ui/Button';

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface HeaderProps {
  user?: User;
  onLogout?: () => void;
  showNavigation?: boolean;
}

export const Header = React.memo<HeaderProps>(({
  user,
  onLogout,
  showNavigation = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Practice', href: '/practice' },
    { label: 'Mock Exams', href: '/mock-exams' },
    { label: 'Progress', href: '/progress' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                SIA Exam Prep
              </span>
            </a>

            {/* Desktop Navigation */}
            {showNavigation && (
              <nav className="hidden md:flex items-center gap-1">
                {navigationLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* User Menu - Desktop */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    aria-label="User menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-elevated border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile Settings
                        </a>
                        <a
                          href="/subscription"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Subscription
                        </a>
                        <button
                          onClick={onLogout}
                          className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {showNavigation && (
              <nav className="space-y-1 mb-4">
                {navigationLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
            {user ? (
              <div className="space-y-1 pt-4 border-t border-gray-200">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </a>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-base text-error-600 hover:bg-error-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="md" fullWidth>
                  Sign In
                </Button>
                <Button variant="primary" size="md" fullWidth>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
