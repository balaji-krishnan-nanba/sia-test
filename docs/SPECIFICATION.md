# Technical Specification - SIA Exam Prep

> **Version:** 1.0
> **Last Updated:** December 7, 2025
> **Status:** Planning Phase

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Application Structure](#application-structure)
3. [Page Specifications](#page-specifications)
4. [Features & Functionality](#features--functionality)
5. [User Flows](#user-flows)
6. [Data Models](#data-models)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Performance Requirements](#performance-requirements)
9. [Security Requirements](#security-requirements)
10. [Mobile Considerations](#mobile-considerations)

---

## Technology Stack

### Frontend

**Framework:** Next.js 14+ (App Router)

- **Why Next.js:**
  - Server-side rendering (SSR) for SEO
  - Built-in routing and API routes
  - Excellent performance with React Server Components
  - Image optimization
  - Great developer experience

**Language:** TypeScript

- Type safety reduces bugs
- Better IDE support and autocomplete
- Self-documenting code

**UI Framework:** React 18+

**Styling:** Tailwind CSS 3+

- **Why Tailwind:**
  - Rapid development with utility classes
  - Consistent design system
  - Excellent mobile-first responsive design
  - Small production bundle size (purged CSS)
  - Great documentation and community

**UI Components:**

- shadcn/ui (Radix UI primitives + Tailwind)
- Headless UI (for complex components like modals, dropdowns)
- Custom components for exam-specific UI

**State Management:**

- React Context API (for global state like user session)
- Zustand (lightweight alternative to Redux for client state)
- React Query / TanStack Query (for server state and caching)

**Forms:**

- React Hook Form (performant, easy validation)
- Zod (schema validation)

**Icons:**

- Lucide React (clean, consistent icon set)
- Hero Icons (backup)

### Backend

**Backend-as-a-Service:** Supabase

- **Why Supabase:**
  - PostgreSQL database (powerful, relational)
  - Built-in authentication (Google OAuth, email)
  - Row-level security (RLS) for data protection
  - Real-time capabilities (if needed for leaderboards, etc.)
  - Storage for downloadable study guides (if needed)
  - Edge functions for serverless logic
  - Generous free tier, scales easily

**API Layer:**

- Next.js API Routes (for custom logic)
- Supabase Client (for database queries)
- Edge Functions (for complex operations)

### Payments

**Payment Provider:** Stripe

- **Why Stripe:**
  - Industry-leading payment processing
  - Supports one-time payments (our model)
  - Easy integration with Next.js
  - Handles VAT/tax automatically
  - Excellent documentation
  - Secure, PCI-compliant

**Implementation:**

- Stripe Checkout (hosted payment page - fastest to implement)
- Stripe Customer Portal (for receipt access)
- Webhook handling for payment confirmation

### Authentication

**Provider:** Supabase Auth + Google OAuth

- **Why:**
  - Reduces friction (users already have Google accounts)
  - No password management hassles
  - Secure by default
  - Easy to add email/password later if needed

**Session Management:**

- JWT tokens (handled by Supabase)
- Secure httpOnly cookies
- Middleware for protected routes

### Hosting & Deployment

**Frontend Hosting:** Vercel

- **Why Vercel:**
  - Built by Next.js creators (perfect integration)
  - Automatic deployments from Git
  - Edge network for fast global access
  - Free tier for MVP, scales easily
  - Environment variable management
  - Analytics and monitoring

**Database:** Supabase (hosted PostgreSQL)

**CDN:** Vercel Edge Network

**Domain:** siaexamprep.co.uk (to be configured)

### Development Tools

**Version Control:** Git + GitHub

**Package Manager:** npm or pnpm

**Code Quality:**

- ESLint (linting)
- Prettier (code formatting)
- TypeScript (type checking)
- Husky (pre-commit hooks)

**Testing (future):**

- Vitest (unit tests)
- Playwright (E2E tests)

**Analytics:**

- Vercel Analytics (built-in)
- Google Analytics 4 (optional, for deeper insights)
- Supabase Analytics (database usage)

---

## Application Structure

### Directory Structure

```
sia-exam-prep/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Dashboard layout group (authenticated)
│   │   ├── dashboard/
│   │   ├── practice/
│   │   ├── mock-exam/
│   │   ├── progress/
│   │   └── settings/
│   ├── (marketing)/              # Marketing layout group (public)
│   │   ├── page.tsx              # Landing page
│   │   ├── about/
│   │   ├── pricing/
│   │   └── how-it-works/
│   ├── api/                      # API routes
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   └── webhook/
│   │   └── questions/
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── exam/                     # Exam-specific components
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerOptions.tsx
│   │   ├── ExamTimer.tsx
│   │   └── ResultsSummary.tsx
│   ├── dashboard/
│   ├── marketing/
│   └── layouts/
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase client and helpers
│   ├── stripe/                   # Stripe helpers
│   ├── utils.ts                  # General utilities
│   └── constants.ts              # Constants
├── types/                        # TypeScript type definitions
│   ├── exam.ts
│   ├── user.ts
│   └── database.ts
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useQuestions.ts
│   └── useProgress.ts
├── config/                       # Configuration files
│   └── exam-config.ts            # Exam metadata
├── public/                       # Static assets
│   ├── images/
│   └── study-guides/
├── supabase/                     # Supabase migrations and functions
│   ├── migrations/
│   └── functions/
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Page Specifications

### 1. Landing Page (/)

**Purpose:** Convert visitors to signups

**URL:** `https://siaexamprep.co.uk/`

**Layout:** Marketing layout (navbar + footer)

**Sections:**

1. **Hero Section**
   - Headline: "Pass Your SIA Exam with Confidence"
   - Subheadline: "2,430+ practice questions for Door Supervisor, Security Guard, CCTV, and Close Protection"
   - CTA: "Start Practicing Free" (primary button)
   - CTA: "See Pricing" (secondary button)
   - Hero image/illustration (person studying on phone)

2. **Social Proof**
   - "Join 1,000+ candidates preparing for SIA exams"
   - Star rating (if we have reviews)
   - Pass rate stat (if we have data)

3. **Key Features** (3-column grid)
   - 2,430+ Verified Questions
   - Realistic Mock Exams
   - Track Your Progress

4. **Exam Types Covered** (4 cards)
   - Door Supervisor (703 questions)
   - Security Guard (579 questions)
   - CCTV Operator (296 questions)
   - Close Protection (852 questions)

5. **How It Works** (3-step process)
   - Step 1: Choose your exam type
   - Step 2: Practice questions & take mock exams
   - Step 3: Pass your SIA exam with confidence

6. **Pricing Preview**
   - Free tier highlights
   - Premium pricing (£9.99 single / £24.99 all access)
   - "One-time payment, no subscription"
   - CTA: "Get Started Free"

7. **Testimonials** (if available)
   - 3 candidate testimonials with photos

8. **FAQ Section**
   - 5-8 common questions
   - Expandable accordion UI

9. **Final CTA**
   - "Ready to pass your SIA exam?"
   - "Start Practicing Free" button

**Features:**

- Fully responsive (mobile-first)
- Fast loading (optimized images, lazy loading)
- SEO optimized (meta tags, structured data)
- Accessible (ARIA labels, keyboard navigation)

---

### 2. Pricing Page (/pricing)

**Purpose:** Explain pricing, drive conversions

**URL:** `https://siaexamprep.co.uk/pricing`

**Layout:** Marketing layout

**Sections:**

1. **Header**
   - "Simple, Transparent Pricing"
   - "One-time payment. No subscription. Cancel anytime."

2. **Pricing Cards** (3 columns)

   **Free Tier:**
   - £0
   - 10-15 questions/day
   - 1 mock exam/week
   - Basic progress tracking
   - CTA: "Start Free"

   **Single Exam:**
   - £9.99 one-time
   - Full access to one exam type
   - Unlimited questions & mock exams
   - Advanced analytics
   - Downloadable study guides
   - CTA: "Buy Now"

   **All Access (Most Popular badge):**
   - £24.99 one-time
   - All 4 exam types
   - 2,430+ questions
   - Everything in Single Exam
   - CTA: "Buy Now"

3. **Pricing Comparison Table**
   - Feature-by-feature comparison
   - Check marks for included features

4. **Value Proposition**
   - "Compared to training courses (£200-£3,000), our prep is a tiny investment"
   - "Avoid exam resit fees (£40-£60) by being fully prepared"

5. **FAQ**
   - "Can I upgrade later?" (Yes)
   - "Is it really one-time?" (Yes)
   - "What payment methods do you accept?" (Card via Stripe)
   - "Can I get a refund?" (Refund policy)

**Features:**

- Dynamic pricing display
- Stripe integration for checkout
- Highlight recommended tier
- A/B testing capability (for pricing experiments)

---

### 3. How It Works Page (/how-it-works)

**Purpose:** Educate users on platform functionality

**URL:** `https://siaexamprep.co.uk/how-it-works`

**Layout:** Marketing layout

**Sections:**

1. **Overview**
   - "Master your SIA exam in 3 simple steps"

2. **Step-by-Step Guide** (vertical timeline)

   **Step 1: Choose Your Exam**
   - Screenshot: Exam selection dashboard
   - Description: Select from Door Supervisor, Security Guard, CCTV, or Close Protection

   **Step 2: Practice & Learn**
   - Screenshot: Practice mode interface
   - Description: Answer questions, read detailed explanations, track your progress

   **Step 3: Take Mock Exams**
   - Screenshot: Mock exam interface
   - Description: Test yourself with timed, realistic mock exams

   **Step 4: Pass Your Exam**
   - Screenshot: Progress dashboard showing 85%+ readiness
   - Description: Know when you're ready, sit your real exam with confidence

3. **Features Deep Dive**

   **Practice Mode:**
   - Random questions from your chosen exam type
   - Instant feedback with explanations
   - Bookmark difficult questions

   **Mock Exam Mode:**
   - Timed exams matching real SIA format
   - 60 questions / 90 minutes (DS)
   - 40 questions / 60 minutes (SG, CCTV)
   - 132 questions / 200 minutes (CP)
   - Results summary with breakdown by unit

   **Progress Tracking:**
   - Overall score by exam type
   - Chapter-level breakdown
   - Identify weak areas
   - Track improvement over time

4. **Platform Tour** (video or interactive demo - future)

5. **CTA**
   - "Ready to start?"
   - "Create Free Account"

---

### 4. About Page (/about)

**Purpose:** Build trust, explain mission

**URL:** `https://siaexamprep.co.uk/about`

**Layout:** Marketing layout

**Sections:**

1. **Mission Statement**
   - "We help aspiring security professionals pass their SIA exams on the first try"

2. **Our Story**
   - Why we built this platform
   - Gap in the market (poor existing resources)

3. **Our Question Bank**
   - 2,430+ questions across 93 chapters
   - Verified against current UK legislation
   - Includes 2023-2025 legal updates
   - Difficulty-balanced and answer-randomized

4. **Our Commitment**
   - Accurate, up-to-date content
   - Fair pricing
   - Continuous improvement
   - Responsive support

5. **CTA**
   - "Join us in your SIA exam journey"

---

### 5. Dashboard (/dashboard)

**Purpose:** Central hub for authenticated users

**URL:** `https://siaexamprep.co.uk/dashboard`

**Layout:** Dashboard layout (sidebar navigation)

**Access:** Authenticated users only

**Sections:**

1. **Welcome Header**
   - "Welcome back, [Name]!"
   - Current date/time

2. **Quick Stats** (4 cards)
   - Total Questions Attempted
   - Current Accuracy Rate
   - Mock Exams Taken
   - Study Streak (days)

3. **Active Exam Preparation**
   - If user has selected exam(s):
     - Progress bar for each exam type
     - "Continue Practicing" button
     - "Start Mock Exam" button

   - If user hasn't selected exam:
     - "Choose your exam type to get started"
     - Exam selection cards

4. **Recent Activity**
   - Last 5 practice sessions
   - Date, exam type, questions answered, accuracy

5. **Recommended Actions**
   - "You haven't practiced Unit 2 - try these questions"
   - "Take a mock exam to test your knowledge"
   - "Your accuracy in Unit 3 is 65% - review weak areas"

6. **Upgrade Prompt** (if free user)
   - "Unlock unlimited questions and mock exams"
   - "Upgrade to Premium" CTA

**Features:**

- Responsive sidebar (collapses on mobile)
- Real-time data updates
- Loading states
- Empty states (if no activity yet)

---

### 6. Practice Mode (/practice)

**Purpose:** Practice questions by exam type/unit/chapter

**URL:** `https://siaexamprep.co.uk/practice`

**Layout:** Dashboard layout

**Access:** Authenticated users (free & premium)

**Flow:**

1. **Exam Selection** (if not already selected)
   - Choose exam type: DS, SG, CCTV, CP
   - Choose practice mode:
     - Random (all chapters)
     - By Unit
     - By Chapter

2. **Practice Interface**

   **Question Display:**
   - Question counter: "Question 5 of 703"
   - Difficulty indicator: "Medium"
   - Question text
   - Four answer options (A, B, C, D)
   - "Submit Answer" button

   **After Answer Submitted:**
   - Correct/Incorrect indicator (green checkmark / red X)
   - Explanation text
   - Legal citations (if applicable)
   - "Next Question" button
   - "Bookmark this question" option

   **Sidebar (desktop) / Bottom bar (mobile):**
   - Progress: X questions answered
   - Accuracy: X% correct
   - "End Practice" button

3. **Practice Summary** (when user ends practice)
   - Total questions answered
   - Accuracy percentage
   - Breakdown by unit/chapter
   - "Review Incorrect Answers" button
   - "Practice Again" button
   - "Return to Dashboard" button

**Free Tier Limitations:**

- 10-15 questions per day
- Show counter: "7 questions remaining today"
- Upgrade prompt when limit reached

**Premium Features:**

- Unlimited questions
- Filter by difficulty
- Review bookmarked questions
- Track progress by chapter

---

### 7. Mock Exam Mode (/mock-exam)

**Purpose:** Take timed, realistic mock exams

**URL:** `https://siaexamprep.co.uk/mock-exam`

**Layout:** Full-screen exam layout (minimal distractions)

**Access:** Authenticated users

**Flow:**

1. **Exam Setup**
   - Choose exam type (DS, SG, CCTV, CP)
   - Exam details displayed:
     - Door Supervisor: 60 questions, 90 minutes
     - Security Guard: 40 questions, 60 minutes
     - CCTV: 40 questions, 60 minutes
     - Close Protection: 132 questions (4 exams), 200 minutes
   - "Start Mock Exam" button
   - Warning: "Once started, timer cannot be paused"

2. **Exam Interface**

   **Header:**
   - Timer (counts down): "45:30 remaining"
   - Question counter: "Question 12 of 60"
   - "End Exam Early" button (with confirmation modal)

   **Question Area:**
   - Question text
   - Four answer options
   - "Flag for Review" checkbox
   - "Next" / "Previous" buttons

   **Question Navigator (optional sidebar):**
   - Grid of question numbers
   - Color coded:
     - Green: Answered
     - Yellow: Flagged
     - Gray: Not answered
   - Click to jump to question

3. **Exam Completion**

   **Automatic Submission:**
   - When time runs out, exam auto-submits

   **Manual Submission:**
   - "Submit Exam" button
   - Confirmation modal: "Are you sure? You have X unanswered questions"

4. **Results Page**

   **Overall Score:**
   - Large percentage display: "72%"
   - Pass/Fail indicator (70% pass mark)
     - If pass: Green badge "PASS"
     - If fail: Red badge "FAIL - 70% required"

   **Breakdown:**
   - Score by unit:
     - Unit 1: 32/40 (80%)
     - Unit 2: 11/20 (55%) - flagged in red
   - Score by difficulty:
     - Easy: 18/20 (90%)
     - Medium: 15/25 (60%)
     - Hard: 10/15 (67%)

   **Detailed Review:**
   - List of all questions with:
     - Question text
     - Your answer
     - Correct answer
     - Explanation
   - Filter options:
     - All questions
     - Incorrect only
     - Flagged only

   **Actions:**
   - "Retake Mock Exam" button
   - "Practice Weak Areas" button (deep link to practice mode for low-scoring units)
   - "Return to Dashboard" button

**Free Tier Limitations:**

- 1 mock exam per week
- Show counter: "Next mock exam available in 5 days"
- Upgrade prompt

**Premium Features:**

- Unlimited mock exams
- Export results as PDF
- Compare results over time (trend chart)

---

### 8. Progress Page (/progress)

**Purpose:** Detailed analytics and progress tracking

**URL:** `https://siaexamprep.co.uk/progress`

**Layout:** Dashboard layout

**Access:** Authenticated users

**Sections:**

1. **Overall Progress**

   **For Each Exam Type:**
   - Progress bar: "Door Supervisor: 450/703 questions completed (64%)"
   - Accuracy: 78%
   - Estimated Readiness: "Not Ready / Ready / Exam Ready"
     - Based on: completion % + accuracy threshold
     - Example: "Exam Ready" = 500+ questions, 75%+ accuracy

2. **Detailed Breakdown**

   **By Unit:**
   - Expandable accordion for each unit
   - Unit 1: Working in Private Security Industry
     - Questions attempted: 120/280
     - Accuracy: 82%
     - Last practiced: 2 days ago

   **By Chapter (Premium only):**
   - Within each unit, show chapter breakdown
   - Chapter 1.1: Private Security Industry Overview
     - Questions attempted: 15/25
     - Accuracy: 87%
     - Weakest topics: "SIA licence conditions"

3. **Mock Exam History**
   - List of past mock exams
   - Date, score, pass/fail
   - "View Details" link

4. **Study Recommendations**
   - AI-generated suggestions:
     - "Focus on Unit 2, Chapter 2.5 (Drugs Awareness) - your accuracy is 60%"
     - "You're ready for a mock exam - test your knowledge!"
     - "Great job on Unit 1 - 90% accuracy!"

5. **Charts (Premium only)**
   - Accuracy trend over time (line chart)
   - Questions attempted per day (bar chart)
   - Score distribution by difficulty (pie chart)

**Free Tier:**

- Overall stats only
- No chapter-level breakdown
- Upgrade prompt

**Premium Features:**

- Full chapter-level analytics
- Charts and visualizations
- Export progress report as PDF

---

### 9. Settings Page (/settings)

**Purpose:** User account and preferences management

**URL:** `https://siaexamprep.co.uk/settings`

**Layout:** Dashboard layout

**Access:** Authenticated users

**Sections:**

1. **Account Information**
   - Email: user@example.com (read-only, from Google OAuth)
   - Display Name: [editable]
   - Avatar: [Google profile picture]

2. **Subscription Status**

   **If Free User:**
   - "Free Plan"
   - "You have 8 questions remaining today"
   - "Upgrade to Premium" button

   **If Premium User:**
   - "Premium Plan: Single Exam (Door Supervisor)" or "All Access"
   - Purchase date
   - "View Receipt" button (link to Stripe customer portal)

3. **Exam Preferences**
   - Default exam type (for quick practice)
   - Show explanations immediately (toggle)
   - Enable sound effects (toggle)
   - Theme: Light / Dark / System

4. **Notifications (future)**
   - Email reminders (toggle)
   - Study streak notifications (toggle)

5. **Data & Privacy**
   - "Download my data" button (GDPR compliance)
   - "Delete account" button (with confirmation)

6. **Support**
   - "Contact Support" link
   - "FAQs" link

---

### 10. Payment/Checkout Flow

**URL:** Handled by Stripe Checkout (external)

**Flow:**

1. **User clicks "Upgrade" or "Buy Now"**
   - From pricing page, dashboard, or upgrade prompt

2. **Tier Selection Modal (if applicable)**
   - If clicked generic "Upgrade" button:
     - Show modal: "Choose your plan"
     - Single Exam (£9.99) - with exam type dropdown
     - All Access (£24.99)

3. **Redirect to Stripe Checkout**
   - Pre-filled with user email
   - Display item: "SIA Exam Prep - [Tier Name]"
   - Price: £9.99 or £24.99 (one-time)
   - VAT calculated automatically
   - Payment methods: Card

4. **Payment Confirmation**
   - Stripe processes payment
   - Redirects back to success page: `/payment/success`

5. **Success Page (/payment/success)**
   - "Payment Successful!"
   - "Thank you for your purchase"
   - "Your account has been upgraded to [Tier]"
   - "Start Practicing" button (to dashboard)
   - Email receipt sent automatically

6. **Webhook Processing**
   - Stripe webhook triggers on successful payment
   - Update user record in database:
     - `subscription_tier`: 'single_exam' or 'all_access'
     - `subscription_status`: 'active'
     - `exam_access`: ['door-supervisor'] or ['door-supervisor', 'security-guard', 'cctv', 'close-protection']
   - Send welcome email (optional)

---

## Features & Functionality

### Core Features (MVP)

#### 1. User Authentication

**Features:**

- Sign up with Google OAuth
- Sign in with Google OAuth
- Session management (persistent login)
- Sign out
- Protected routes (redirect to login if unauthenticated)

**Implementation:**

- Supabase Auth with Google provider
- Middleware for route protection
- JWT token storage in httpOnly cookies

#### 2. Question Bank

**Features:**

- Load questions from Supabase database
- Support for 4 exam types
- Metadata: difficulty, unit, chapter, exam type
- Answer options (A, B, C, D)
- Correct answer
- Detailed explanations with legal citations

**Database Schema (simplified):**

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  exam_type TEXT NOT NULL, -- 'door-supervisor', 'security-guard', 'cctv', 'close-protection'
  unit_number INT NOT NULL,
  chapter_number DECIMAL(3,1) NOT NULL, -- e.g., 1.3
  chapter_title TEXT NOT NULL,
  difficulty TEXT NOT NULL, -- 'easy', 'medium', 'hard'
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
  explanation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Practice Mode

**Features:**

- Random question selection (from chosen exam type/unit/chapter)
- Display question with 4 answer options
- Submit answer
- Show correct/incorrect feedback
- Display explanation
- Track questions attempted and accuracy
- Bookmark questions (premium)
- Free tier: 10-15 questions/day limit

**State Management:**

- Track current question
- Track answers submitted
- Track accuracy in real-time
- Persist progress to database

#### 4. Mock Exam Mode

**Features:**

- Realistic exam simulation
- Timed (countdown timer)
- Question navigation (next, previous, jump to question)
- Flag questions for review
- Auto-submit when time expires
- Manual submit with confirmation
- Results summary (overall score, breakdown by unit)
- Detailed review of all questions
- Free tier: 1 mock exam per week limit

**Implementation:**

- Timer using `setInterval`
- Local state for answers (persist on submit)
- Generate exam questions (random selection matching real exam format)
- Calculate score
- Store results in database

#### 5. Progress Tracking

**Features:**

- Track questions attempted by exam type, unit, chapter
- Track accuracy (overall and by unit/chapter)
- Track mock exam attempts and scores
- Display readiness indicator
- Study recommendations based on weak areas
- Charts and visualizations (premium)

**Database Schema (simplified):**

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  exam_type TEXT NOT NULL,
  unit_number INT,
  chapter_number DECIMAL(3,1),
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  last_practiced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mock_exam_results (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  exam_type TEXT NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  score_percentage DECIMAL(5,2) NOT NULL,
  pass_fail TEXT NOT NULL, -- 'pass' or 'fail'
  time_taken_seconds INT,
  breakdown JSONB, -- unit/chapter breakdown
  completed_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Payment & Subscription

**Features:**

- One-time payment via Stripe
- Two tiers: Single Exam (£9.99), All Access (£24.99)
- Stripe Checkout integration
- Webhook for payment confirmation
- Update user subscription status in database
- Access control based on subscription tier

**Database Schema (simplified):**

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  tier TEXT NOT NULL, -- 'free', 'single_exam', 'all_access'
  exam_access TEXT[], -- ['door-supervisor'] or ['door-supervisor', 'security-guard', 'cctv', 'close-protection']
  stripe_payment_id TEXT,
  purchased_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Advanced Features (Post-MVP)

#### 7. Bookmarking (Premium)

- Save questions for later review
- "Review Bookmarked Questions" mode
- Remove bookmarks

#### 8. Study Guides (Premium)

- Downloadable PDFs by exam type
- Stored in Supabase Storage
- Generated links for download

#### 9. Community Features (Future)

- Forum or Q&A section
- Discuss questions
- User-generated study tips

#### 10. Referral Program (Future)

- Invite friends
- Earn bonus questions or discount codes

---

## User Flows

### Flow 1: New User Signup & First Practice Session

1. User lands on homepage
2. Clicks "Start Practicing Free"
3. Redirected to `/login`
4. Clicks "Sign in with Google"
5. Google OAuth consent screen
6. User approves, redirected to `/dashboard`
7. Dashboard shows "Choose your exam type"
8. User selects "Door Supervisor"
9. Clicks "Start Practicing"
10. Redirected to `/practice`
11. Practice mode loads random DS questions
12. User answers 10 questions (free tier limit)
13. Sees "You've used your 10 free questions today. Upgrade for unlimited access."
14. User explores upgrade options

### Flow 2: Premium User Takes Mock Exam

1. User signs in, lands on `/dashboard`
2. Dashboard shows "You're 78% ready for the Door Supervisor exam"
3. User clicks "Start Mock Exam"
4. Redirected to `/mock-exam`
5. Exam setup page: "Door Supervisor - 60 questions, 90 minutes"
6. User clicks "Start Mock Exam"
7. Timer starts, first question loads
8. User answers questions, flags a few for review
9. After 45 minutes, completes all 60 questions
10. Clicks "Submit Exam"
11. Confirmation modal: "Submit exam? You have answered all questions."
12. User confirms
13. Results page loads: "PASS - 78% (47/60 correct)"
14. User reviews incorrect answers
15. Clicks "Practice Weak Areas" → redirected to practice mode for Unit 2 (lowest score)

### Flow 3: Free User Upgrades to Premium

1. User on `/dashboard`, sees "Upgrade to Premium" banner
2. Clicks "Upgrade"
3. Modal appears: "Choose your plan"
4. User selects "All Access - £24.99"
5. Clicks "Continue to Payment"
6. Redirected to Stripe Checkout
7. Enters card details
8. Completes payment
9. Redirected to `/payment/success`
10. Database updated via webhook (tier = 'all_access')
11. User clicks "Go to Dashboard"
12. Dashboard now shows premium features unlocked
13. User starts unlimited practice

---

## Data Models

### User

**Source:** Supabase Auth (auth.users table)

```typescript
interface User {
  id: string; // UUID
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}
```

### Subscription

```typescript
interface Subscription {
  id: string; // UUID
  user_id: string; // FK to auth.users
  tier: 'free' | 'single_exam' | 'all_access';
  exam_access: ExamType[]; // ['door-supervisor'] or all 4
  stripe_payment_id?: string;
  purchased_at?: string;
  created_at: string;
}
```

### Question

```typescript
interface Question {
  id: string; // UUID
  exam_type: ExamType;
  unit_number: number;
  chapter_number: number; // e.g., 1.3
  chapter_title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  created_at: string;
}

type ExamType = 'door-supervisor' | 'security-guard' | 'cctv' | 'close-protection';
```

### UserProgress

```typescript
interface UserProgress {
  id: string; // UUID
  user_id: string; // FK
  exam_type: ExamType;
  unit_number?: number;
  chapter_number?: number;
  questions_attempted: number;
  questions_correct: number;
  accuracy: number; // calculated: (questions_correct / questions_attempted) * 100
  last_practiced_at: string;
  created_at: string;
}
```

### MockExamResult

```typescript
interface MockExamResult {
  id: string; // UUID
  user_id: string; // FK
  exam_type: ExamType;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  pass_fail: 'pass' | 'fail';
  time_taken_seconds: number;
  breakdown: {
    unit_1?: { correct: number; total: number };
    unit_2?: { correct: number; total: number };
    // ... etc
  };
  completed_at: string;
}
```

### UserAnswer (for tracking individual answers)

```typescript
interface UserAnswer {
  id: string; // UUID
  user_id: string; // FK
  question_id: string; // FK
  selected_answer: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  answered_at: string;
}
```

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Critical Requirements:**

1. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Logical tab order
   - Visible focus indicators

2. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text
   - Don't rely on color alone (use icons + color)

3. **ARIA Labels**
   - All buttons, links, form inputs have descriptive labels
   - Screen reader announcements for dynamic content

4. **Text Alternatives**
   - Alt text for images
   - Descriptive link text (not "click here")

5. **Responsive Text**
   - Text resizable up to 200% without breaking layout
   - Minimum font size: 16px for body text

6. **Form Accessibility**
   - Labels associated with inputs
   - Error messages clearly announced
   - Form validation with helpful messages

### Testing

- Use axe DevTools for automated accessibility testing
- Manual keyboard-only testing
- Screen reader testing (NVDA, VoiceOver)

---

## Performance Requirements

### Target Metrics

**Core Web Vitals:**

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Other Metrics:**

- **Time to Interactive (TTI):** < 3.5s
- **First Contentful Paint (FCP):** < 1.8s
- **Page Load Time:** < 3s on 3G

### Optimization Strategies

1. **Image Optimization**
   - Use Next.js Image component
   - WebP format with fallbacks
   - Lazy loading for below-fold images

2. **Code Splitting**
   - Route-based code splitting (automatic with Next.js)
   - Dynamic imports for heavy components

3. **Caching**
   - Static page caching (Next.js ISR)
   - React Query for data caching
   - CDN caching via Vercel Edge Network

4. **Bundle Size**
   - Analyze bundle with `@next/bundle-analyzer`
   - Tree-shaking unused code
   - Minimize third-party dependencies

5. **Database Queries**
   - Index frequently queried columns
   - Limit query results (pagination)
   - Cache common queries

---

## Security Requirements

### Authentication & Authorization

1. **Secure Authentication**
   - OAuth 2.0 via Google (Supabase handles)
   - JWT tokens with expiration
   - httpOnly cookies (protect against XSS)

2. **Row-Level Security (RLS)**
   - Supabase RLS policies:
     - Users can only access their own progress data
     - Questions are read-only for all users
     - Subscriptions are read-only (updated via webhook only)

3. **API Security**
   - Validate all inputs (Zod schemas)
   - Rate limiting (Vercel edge middleware)
   - CORS configuration

### Data Protection

1. **GDPR Compliance**
   - Privacy policy page
   - Cookie consent banner (if using tracking cookies)
   - Data export functionality
   - Account deletion functionality

2. **PCI Compliance**
   - No card data stored (Stripe handles)
   - Use Stripe Checkout (PCI-compliant by default)

3. **Data Encryption**
   - HTTPS everywhere (enforced by Vercel)
   - Database encryption at rest (Supabase default)

### Stripe Webhook Security

- Verify webhook signatures (prevent spoofing)
- Use environment variables for secrets
- Idempotency (handle duplicate events)

---

## Mobile Considerations

### Mobile-First Design

- All pages designed for mobile first
- Responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Touch-Friendly UI

- Minimum touch target size: 44x44px
- Adequate spacing between interactive elements
- Large, tappable buttons

### Performance on Mobile

- Optimize for 3G/4G networks
- Lazy load images and heavy components
- Minimize JavaScript bundle size

### Mobile-Specific Features

- Swipe gestures (optional):
  - Swipe left: Next question
  - Swipe right: Previous question
- Pull-to-refresh on practice mode (future)
- Install as PWA (future consideration)

### Testing

- Test on real devices (iPhone, Android)
- Chrome DevTools device emulation
- Lighthouse mobile audit

---

## Related Documentation

- [PROJECT.md](./PROJECT.md) - Business and product overview
- [EXAMS.md](./EXAMS.md) - Exam structure and metadata
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI/UX design system
- [API.md](./API.md) - API endpoints and integrations
- [DATABASE.md](./DATABASE.md) - Database schema (to be added by database agent)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Hosting and deployment guide

---

*Last Updated: December 7, 2025*
