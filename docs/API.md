# API Documentation - SIA Exam Prep

> **Last Updated:** December 7, 2025

---

## Table of Contents

1. [Supabase Integration](#supabase-integration)
2. [Next.js API Routes](#nextjs-api-routes)
3. [Stripe Integration](#stripe-integration)
4. [Google OAuth Flow](#google-oauth-flow)

---

## Supabase Integration

### Database Queries (via Supabase Client)

#### Get Questions

```typescript
// Get random questions by exam type
const { data: questions, error } = await supabase
  .from('questions')
  .select('*')
  .eq('exam_type', 'door-supervisor')
  .order('random()')
  .limit(15);
```

#### Track User Answer

```typescript
// Insert user answer
const { data, error } = await supabase
  .from('user_answers')
  .insert({
    user_id: userId,
    question_id: questionId,
    selected_answer: 'A',
    is_correct: true,
  });
```

#### Update User Progress

```typescript
// Increment progress counters
const { data, error } = await supabase.rpc('update_user_progress', {
  p_user_id: userId,
  p_exam_type: 'door-supervisor',
  p_unit_number: 1,
  p_chapter_number: 1.1,
  p_is_correct: true,
});
```

---

## Next.js API Routes

### Authentication Endpoints

#### `/api/auth/callback` (GET)

**Purpose:** Handle Supabase Auth callback after Google OAuth

**Flow:**
1. User redirects from Google with auth code
2. Supabase exchanges code for session
3. Store session in cookies
4. Redirect to `/dashboard`

---

### Stripe Endpoints

#### `/api/stripe/create-checkout-session` (POST)

**Purpose:** Create Stripe Checkout session for payment

**Request Body:**
```json
{
  "tier": "single_exam",
  "examType": "door-supervisor"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_..."
}
```

**Implementation:**
```typescript
import Stripe from 'stripe';

export async function POST(req: Request) {
  const { tier, examType } = await req.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const prices = {
    single_exam: 999, // £9.99 in pence
    all_access: 2499, // £24.99 in pence
  };

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: tier === 'single_exam'
              ? `SIA Exam Prep - ${examType}`
              : 'SIA Exam Prep - All Access',
          },
          unit_amount: prices[tier],
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    metadata: {
      tier,
      examType: examType || 'all',
    },
  });

  return Response.json({ url: session.url });
}
```

---

#### `/api/stripe/webhook` (POST)

**Purpose:** Handle Stripe webhook events (payment confirmation)

**Events Handled:**
- `checkout.session.completed` - Payment successful

**Implementation:**
```typescript
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { tier, examType } = session.metadata!;

    // Update user subscription in database
    await supabase.from('subscriptions').upsert({
      user_id: session.client_reference_id,
      tier,
      exam_access: tier === 'all_access'
        ? ['door-supervisor', 'security-guard', 'cctv', 'close-protection']
        : [examType],
      stripe_payment_id: session.payment_intent,
      purchased_at: new Date().toISOString(),
    });
  }

  return Response.json({ received: true });
}
```

---

### Question Endpoints

#### `/api/questions/random` (GET)

**Purpose:** Get random questions for practice mode

**Query Parameters:**
- `examType` - Exam type (required)
- `unit` - Unit number (optional)
- `chapter` - Chapter number (optional)
- `difficulty` - Difficulty level (optional)
- `limit` - Number of questions (default: 15)

**Example Request:**
```
GET /api/questions/random?examType=door-supervisor&unit=1&limit=10
```

**Response:**
```json
{
  "questions": [
    {
      "id": "uuid",
      "exam_type": "door-supervisor",
      "unit_number": 1,
      "chapter_number": 1.1,
      "difficulty": "medium",
      "question_text": "What is...",
      "option_a": "...",
      "option_b": "...",
      "option_c": "...",
      "option_d": "...",
      "correct_answer": "B",
      "explanation": "..."
    }
  ]
}
```

---

#### `/api/questions/submit-answer` (POST)

**Purpose:** Submit user answer and update progress

**Request Body:**
```json
{
  "questionId": "uuid",
  "selectedAnswer": "B"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "explanation": "...",
  "progress": {
    "totalAttempted": 45,
    "totalCorrect": 38,
    "accuracy": 84.4
  }
}
```

---

### Mock Exam Endpoints

#### `/api/mock-exam/generate` (POST)

**Purpose:** Generate mock exam questions

**Request Body:**
```json
{
  "examType": "door-supervisor"
}
```

**Response:**
```json
{
  "examId": "uuid",
  "questions": [...], // 60 questions for DS
  "duration": 90, // minutes
  "passPercentage": 70
}
```

---

#### `/api/mock-exam/submit` (POST)

**Purpose:** Submit completed mock exam

**Request Body:**
```json
{
  "examId": "uuid",
  "answers": {
    "question_id_1": "A",
    "question_id_2": "B",
    // ...
  },
  "timeTakenSeconds": 4320
}
```

**Response:**
```json
{
  "resultId": "uuid",
  "score": 78,
  "totalQuestions": 60,
  "correctAnswers": 47,
  "passFail": "pass",
  "breakdown": {
    "unit_1": { "correct": 32, "total": 40 },
    "unit_2": { "correct": 15, "total": 20 }
  }
}
```

---

## Stripe Integration

### Setup

1. **Create Stripe Account** at stripe.com
2. **Get API Keys:**
   - Publishable Key (client-side)
   - Secret Key (server-side)
   - Webhook Secret (for webhook verification)

3. **Environment Variables:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Configure Webhook:**
   - URL: `https://siaexamprep.co.uk/api/stripe/webhook`
   - Events: `checkout.session.completed`

---

## Google OAuth Flow

### Setup (via Supabase)

1. **Create Google OAuth Credentials:**
   - Go to Google Cloud Console
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://[your-supabase-project].supabase.co/auth/v1/callback`

2. **Configure Supabase:**
   - Dashboard → Authentication → Providers → Google
   - Add Client ID and Client Secret
   - Enable Google provider

3. **Client-Side Login:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(supabaseUrl, supabaseKey);

async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
}
```

---

## Rate Limiting

**Implementation (Next.js Middleware):**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const limit = rateLimit.get(ip);

  if (limit && limit.resetTime > now) {
    if (limit.count >= 100) {
      return new NextResponse('Too many requests', { status: 429 });
    }
    limit.count++;
  } else {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
  }

  return NextResponse.next();
}
```

---

## Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid exam type",
    "details": {}
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions (e.g., free tier limit)
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DATABASE.md](./DATABASE.md) - Database schema
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

*Last Updated: December 7, 2025*
