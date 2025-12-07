# System Architecture - SIA Exam Prep

> **Last Updated:** December 7, 2025
> **Status:** Planning Phase

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Application (React)                   │  │
│  │                                                               │  │
│  │  Pages: Landing, Dashboard, Practice, Mock Exam, Progress    │  │
│  │  Components: QuestionCard, ProgressChart, ExamTimer, etc.    │  │
│  │  State: React Context, Zustand, React Query                  │  │
│  │  Styling: Tailwind CSS                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              │ HTTPS                                 │
│                              ▼                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                               │
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐                      │
│  │  Static Assets   │    │  Next.js API     │                      │
│  │  (Images, CSS,   │    │  Routes          │                      │
│  │   JS bundles)    │    │  /api/stripe     │                      │
│  └──────────────────┘    │  /api/questions  │                      │
│                          └──────────────────┘                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICES                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    SUPABASE                                   │  │
│  │                                                               │  │
│  │  ┌─────────────────┐  ┌────────────────┐  ┌───────────────┐ │  │
│  │  │   PostgreSQL    │  │  Supabase Auth │  │ Edge Functions│ │  │
│  │  │   Database      │  │  (Google OAuth)│  │               │ │  │
│  │  │                 │  │                │  │  - Complex    │ │  │
│  │  │  Tables:        │  │  JWT Tokens    │  │    queries    │ │  │
│  │  │  - questions    │  │  Session Mgmt  │  │  - Business   │ │  │
│  │  │  - users        │  │                │  │    logic      │ │  │
│  │  │  - subscriptions│  └────────────────┘  └───────────────┘ │  │
│  │  │  - user_progress│                                         │  │
│  │  │  - mock_exams   │                                         │  │
│  │  │  - user_answers │                                         │  │
│  │  └─────────────────┘                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                       STRIPE                                  │  │
│  │                                                               │  │
│  │  - Checkout Session (hosted payment page)                    │  │
│  │  - Webhooks (payment confirmation)                           │  │
│  │  - Customer Portal (receipt access)                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Next.js App Router Structure

- **App Router:** Next.js 14 with React Server Components
- **Route Groups:** Organized by layout type (auth, dashboard, marketing)
- **Server Components:** Default for performance (fetch data on server)
- **Client Components:** Interactive UI (marked with `"use client"`)

### State Management

**Three-tier state approach:**

1. **Server State (React Query)**
   - Questions fetched from Supabase
   - User progress data
   - Mock exam results
   - Cached and automatically refreshed

2. **Global Client State (React Context)**
   - User authentication session
   - Current exam type selected
   - Theme preferences

3. **Local Component State (useState)**
   - Form inputs
   - UI interactions
   - Temporary data

---

## Backend Architecture

### Supabase

**PostgreSQL Database:**
- Row-Level Security (RLS) policies for data protection
- Indexed columns for performance
- Foreign key relationships

**Supabase Auth:**
- Google OAuth provider
- JWT tokens (managed automatically)
- Session persistence

**Edge Functions (Serverless):**
- Generate mock exams (random question selection)
- Calculate analytics (progress, weak areas)
- Process complex queries

### Stripe Integration

**Payment Flow:**
1. User clicks "Upgrade" → Create Stripe Checkout Session
2. Redirect to Stripe-hosted payment page
3. User completes payment
4. Stripe sends webhook to `/api/stripe/webhook`
5. Webhook verified, database updated (subscription tier)
6. User redirected to success page

---

## Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Supabase Auth redirects to Google OAuth consent
   ↓
3. User approves
   ↓
4. Google redirects back to Supabase with auth code
   ↓
5. Supabase exchanges code for Google user info
   ↓
6. Supabase creates/updates user in auth.users table
   ↓
7. Supabase issues JWT token
   ↓
8. JWT stored in httpOnly cookie (secure)
   ↓
9. User redirected to /dashboard
   ↓
10. Middleware checks JWT on protected routes
```

---

## Data Flow

### Practice Mode Flow

```
1. User navigates to /practice
   ↓
2. Select exam type (e.g., Door Supervisor)
   ↓
3. Client fetches questions from Supabase
   Query: SELECT * FROM questions WHERE exam_type = 'door-supervisor' ORDER BY RANDOM() LIMIT 15
   ↓
4. Display first question
   ↓
5. User selects answer → submit
   ↓
6. Client validates answer (correct/incorrect)
   ↓
7. Client stores answer in Supabase (user_answers table)
   ↓
8. Update user_progress table (increment questions_attempted, questions_correct)
   ↓
9. Display explanation
   ↓
10. User clicks "Next" → repeat from step 4
```

### Mock Exam Flow

```
1. User starts mock exam
   ↓
2. Generate exam questions (call Supabase Edge Function)
   - Door Supervisor: 60 questions (40 from Units 1&3, 20 from Unit 2)
   - Security Guard: 40 questions (20 from Units 1&3, 20 from Unit 2)
   - Etc.
   ↓
3. Start timer (client-side countdown)
   ↓
4. User answers questions (stored in client state)
   ↓
5. Timer expires OR user submits exam
   ↓
6. Calculate score (client-side)
   ↓
7. Store result in mock_exam_results table
   ↓
8. Display results page with breakdown
```

---

## Security Architecture

### Defense Layers

1. **HTTPS Everywhere** (enforced by Vercel)
2. **Row-Level Security** (Supabase RLS policies)
3. **JWT Authentication** (httpOnly cookies, can't be accessed by JS)
4. **Input Validation** (Zod schemas on API routes)
5. **Rate Limiting** (Vercel edge middleware)
6. **CORS Configuration** (restrict API access)
7. **Stripe Webhook Signature Verification** (prevent spoofing)

### Row-Level Security Examples

```sql
-- Users can only read their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own answers
CREATE POLICY "Users can insert own answers"
  ON user_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Everyone can read questions (but not modify)
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);
```

---

## Performance Optimizations

1. **Static Generation** - Landing page, pricing page (ISR)
2. **Server-Side Rendering** - Dashboard, practice pages (dynamic, personalized)
3. **Image Optimization** - Next.js Image component (WebP, lazy loading)
4. **Code Splitting** - Automatic route-based splitting
5. **React Query Caching** - Reduce duplicate requests
6. **Database Indexing** - Fast queries on frequently accessed columns
7. **CDN Caching** - Vercel Edge Network

---

## Scalability Considerations

**Current Architecture (MVP):**
- Expected load: 100-1,000 concurrent users
- Supabase free tier → Pro tier transition around 1,000 users
- Vercel free tier → Pro tier if needed

**Future Scaling (if needed):**
- Database connection pooling (Supabase Supavisor)
- Read replicas for heavy read operations
- Redis caching layer (for frequently accessed data)
- CDN for downloadable study guides

---

## Monitoring & Analytics

**Vercel Analytics:**
- Page load times
- Core Web Vitals
- Error tracking

**Supabase Logs:**
- Database query performance
- Authentication events
- API errors

**Custom Analytics (Optional):**
- Google Analytics 4
- Track user behavior (page views, conversions)

---

## Related Documentation

- [SPECIFICATION.md](./SPECIFICATION.md) - Technical specification
- [DATABASE.md](./DATABASE.md) - Database schema details
- [API.md](./API.md) - API endpoints
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

*Last Updated: December 7, 2025*
