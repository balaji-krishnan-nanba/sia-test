# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### To Be Done
- Fix TypeScript build errors in utility files
- Set up Supabase database and import question data
- Configure Stripe payment integration
- Test Google OAuth end-to-end
- Deploy MVP to Vercel

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
