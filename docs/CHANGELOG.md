# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### To Be Done
- Set up Supabase database and import question data
- Configure Stripe payment integration
- Test Google OAuth end-to-end
- Deploy MVP to Vercel

---

## [2025-12-08] - Fix White Screen + Timing Issues

### Fixed
- **White Screen on Mock Test**: Protected routes now allow access when Supabase isn't configured
  - Root cause: ProtectedRoute was redirecting to login when Supabase wasn't set up
  - Solution: Added dev mode bypass in ProtectedRoute component
- **TIMING.MOCK_EXAM_DURATION**: Corrected exam timing values to match official SIA specifications
  - Security Guard: 75 → 60 minutes
  - CCTV Operator: 80 → 60 minutes
  - Close Protection: 120 → 200 minutes
  - Door Supervisor: 90 minutes (unchanged, was already correct)

### Added
- **ErrorBoundary component**: Catches runtime JavaScript errors and displays friendly UI
  - Shows error details in development mode
  - Provides "Try Again" and "Go to Home" buttons
  - Prevents white screen crashes

### Technical
- Values now correctly match `EXAM_DETAILS.totalTimeMinutes`
- Added JSDoc comments documenting paper breakdown
- Wrapped main app content with ErrorBoundary for better error handling

---

## [2025-12-07] - Mock Exams Use Real SIA Exam Specifications

### Changed
- **Mock tests now mirror real SIA exams**: Instead of 10 arbitrary tests, each qualification now shows its actual exam papers
  - Door Supervisor: 2 exam papers (40Q/60min + 20Q/30min)
  - Security Guard: 2 exam papers (20Q/30min + 20Q/30min)
  - CCTV Operator: 2 exam papers (20Q/30min + 20Q/30min)
  - Close Protection: 4 exam papers (52Q/80min + 30Q/45min + 20Q/30min + 30Q/45min)

### Added
- **ExamPaperSpec interface**: New type for individual exam paper specifications
- **examPapers array**: Each qualification now has detailed paper breakdown with units, questions, time, and pass marks
- **Unit filtering**: Mock exams filter questions by relevant units for each paper
- **Per-paper timing**: Each exam paper has its own time limit

### Fixed
- **PracticePage**: Removed "Practice All" from unit level (only at chapter level)
- **Question loader URL**: Fixed base path for GitHub Pages

---

## [2025-12-07] - GitHub Pages Deployment

### Added
- **GitHub Actions Workflow**: `.github/workflows/deploy.yml` for automated GitHub Pages deployment
- **Deployment triggers**: Push to `main` or `claude/deploy-github-pages-*` branches
- **Concurrent deployment protection**: Only one deployment runs at a time

### Changed
- **vite.config.ts**: Added `base: '/sia-test/'` for GitHub Pages subdirectory deployment

### Technical
- Uses `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`
- Node.js 20 LTS for build environment
- Automatic artifact caching via npm

---

## [2025-12-07] - Bug Fix - Navigation & Quiz Page Issues

### Fixed
- **QuizPage**: Fixed React hooks violation - useEffect was placed after conditional returns, violating Rules of Hooks and causing blank page
- **MockExamPage**: Added dynamic exam type support from URL params (was hardcoded to door-supervisor only)

### Changed
- **MockExamPage**: Now reads `?exam=` parameter from URL to support all 4 exam types
- **MockExamPage**: Database records now use correct qualification code based on selected exam

### Technical
- Moved debug useEffect to proper location before conditional returns in QuizPage.tsx
- Added EXAM_NAMES and EXAM_CODES lookup maps for exam type handling
- Updated callback dependencies to include examSlug and examCode

---

## [2025-12-07] - Page Completion & E2E Testing

### Added
- **HomePage**: Complete professional landing page with hero, features, exam types, how-it-works, and CTA sections
- **RegisterPage**: Split-layout registration page with benefits panel and Google OAuth
- **SettingsPage**: Full settings page with Profile, Preferences, Notifications, and Account sections
- **PricingPage**: 3-tier pricing page (Free, £9.99, £24.99) with comparison table and FAQ

### Changed
- **DashboardPage**: Enhanced UI with sticky header, time-based greeting, visual exam selection cards, and study tips
- **Question Files**: Copied to `public/data/questions/` for Vite static serving
- **SubscriptionTier**: Re-exported from subscription.ts for proper imports

### Fixed
- **ProgressPage**: Removed unused React import
- **MockExamPage**: Added eslint-disable comment for unused variable
- **Type Exports**: Fixed SubscriptionTier not being exported from subscription.ts

### Technical Debt
- Pre-existing TypeScript strict errors in utility files (questionRandomizer.ts, scorer.ts, validation.ts)
- Pre-existing lint warnings in layout and legal components

---

## [2025-12-07] - Documentation Structure Created

### Added
- Complete `/docs` directory structure with 13 documentation files
- **PROJECT.md**: Business model, pricing strategy, target audience, competitive landscape, project roadmap
- **SPECIFICATION.md**: Technical stack, 10 page specifications, features, user flows, data models, accessibility requirements
- **EXAMS.md**: Accurate exam metadata for all 4 SIA qualifications with JSON configuration ready for application use
- **DESIGN_SYSTEM.md**: Complete design system with brand colors, typography scale, spacing, Tailwind configuration, component patterns
- **ARCHITECTURE.md**: System architecture diagrams, authentication flow, data flow, security architecture, performance optimizations
- **API.md**: API endpoint documentation for Supabase integration, Stripe payments, Next.js API routes
- **DEPLOYMENT.md**: Step-by-step deployment guide for Vercel, Supabase setup, Stripe configuration, domain setup
- **SESSION_LOG.md**: Session activity tracking file initialized
- **CHANGELOG.md**: This file - change tracking initialized
- **DECISIONS.md**: Architecture decision log initialized
- **TODO.md**: Prioritized task backlog initialized
- **WORK_IN_PROGRESS.md**: Incomplete work tracking initialized

### Changed
- Nothing (first changelog entry)

### Fixed
- Nothing (first changelog entry)

### Removed
- Nothing (first changelog entry)

### Technical Debt
- None introduced in this session

---

## [2025-12-07] - Initial Project Setup (Prior to Documentation)

### Added
- Question bank: 2,430 practice questions across 93 chapter files
- 4 exam types: Door Supervisor (DS), Security Guard (SG), CCTV Operator (CCTV), Close Protection (CP)
- Question generation prompts for all exam types
- Questions/PROJECT_DOCUMENTATION.md: Detailed question bank documentation with quality analysis
- Questions/SIA-ALL-QUALIFICATIONS-MASTER-README.txt: Comprehensive exam type overview
- Basic CLAUDE.md: Generic workflow rules and ULTRATHINK requirements
- Basic README.md: Minimal project description

### Changed
- Nothing (initial commit)

---

*Last Updated: December 7, 2025*
