# TODO & Backlog

## 🔴 High Priority - Before Launch

- [ ] **Fix TypeScript Build Errors**: Address strict type errors in utility files
  - Context: Required for production build
  - Files: src/utils/questionRandomizer.ts, src/utils/scorer.ts, src/utils/validation.ts
  - Estimate: 2-3 hours

- [ ] **Setup Supabase Project**: Create project, get API keys, configure .env
  - Context: Backend for auth and data storage
  - Files: .env, supabase/
  - Estimate: 30 minutes

- [ ] **Deploy Database Schema**: Apply migrations to Supabase
  - Context: Tables needed for user data and progress
  - Files: supabase/migrations/001_initial_schema.sql
  - Estimate: 30 minutes

- [ ] **Configure Google OAuth**: Set up OAuth in Supabase dashboard
  - Context: Primary authentication method
  - Files: Supabase Auth settings
  - Estimate: 15 minutes

- [ ] **Test Authentication Flow**: Verify login/logout works end-to-end
  - Context: Critical user flow
  - Files: src/contexts/AuthContext.tsx, src/pages/LoginPage.tsx
  - Estimate: 1-2 hours

## 🟡 Medium Priority - Before Public Launch

- [ ] **Stripe Integration Testing**: Test payment flow with test keys
  - Context: Revenue generation
  - Files: src/lib/stripe.ts, src/pages/PricingPage.tsx
  - Estimate: 2-3 hours

- [ ] **Legal Document Review**: Have UK solicitor review legal pages
  - Context: CRITICAL for compliance
  - Cost: £1,000-£2,500
  - Estimate: 1-2 weeks

- [ ] **ICO Registration**: Register as data controller
  - Context: Required for GDPR compliance
  - Cost: £40-£60/year
  - Estimate: 1 hour

- [ ] **Replace Legal Placeholders**: Update [Company Name] in legal docs
  - Context: Legal compliance
  - Files: src/legal/*.md
  - Estimate: 30 minutes

- [ ] **Mobile Testing**: Test on real iOS and Android devices
  - Context: UX verification
  - Estimate: 2-3 hours

- [ ] **Accessibility Audit**: WCAG 2.1 AA compliance check
  - Context: Legal requirement
  - Estimate: 4-6 hours

## 🟢 Low Priority / Nice to Have

- [ ] **Dark Mode**: Theme toggle with persistence
  - Context: User preference
  - Estimate: 2-3 hours

- [ ] **PWA Support**: Offline functionality, install prompt
  - Context: Better mobile experience
  - Estimate: 4-6 hours

- [ ] **Error Tracking**: Set up Sentry for production
  - Context: Bug monitoring
  - Estimate: 1-2 hours

- [ ] **Analytics**: Google Analytics or similar
  - Context: User behavior insights
  - Estimate: 1-2 hours

- [ ] **Performance Optimization**: Lighthouse score > 90
  - Context: SEO and UX
  - Estimate: 2-4 hours

## 💡 Future Enhancements

- [ ] Leaderboard system
- [ ] Study groups / collaborative features
- [ ] Mobile app (React Native)
- [ ] Video explanations for questions
- [ ] Flashcards mode
- [ ] Spaced repetition algorithm
- [ ] Voice mode for accessibility
- [ ] Email notifications for streaks
- [ ] Social sharing features
- [ ] Referral program

## ✅ Recently Completed

- [x] **2025-12-07** - HomePage: Professional landing page with hero, features, exam types
- [x] **2025-12-07** - RegisterPage: Split-layout with Google OAuth
- [x] **2025-12-07** - SettingsPage: Full settings UI with 4 sections
- [x] **2025-12-07** - PricingPage: 3-tier pricing with comparison and FAQ
- [x] **2025-12-07** - DashboardPage: Enhanced UI with exam selection
- [x] **2025-12-07** - Question files copied to public folder
- [x] **2025-12-07** - QuizPage: Full practice quiz functionality
- [x] **2025-12-07** - MockExamPage: Timed exam with results
- [x] **2025-12-07** - ProgressPage: Analytics and stats display
- [x] **2025-12-07** - 27 UI components built
- [x] **2025-12-07** - 2,139 questions parsed and loaded
- [x] **2025-12-07** - Database schema designed
- [x] **2025-12-07** - Legal documents created
- [x] **2025-12-07** - Documentation completed

---

*Last Updated: December 7, 2025*
