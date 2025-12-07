# Database Schema Documentation

## Table of Contents

1. [Overview](#overview)
2. [Schema Diagram](#schema-diagram)
3. [Tables](#tables)
4. [Indexes](#indexes)
5. [Functions](#functions)
6. [Row Level Security](#row-level-security)
7. [Common Queries](#common-queries)
8. [Setup Instructions](#setup-instructions)
9. [Migration Guide](#migration-guide)
10. [Performance Optimization](#performance-optimization)
11. [Backup and Maintenance](#backup-and-maintenance)

---

## Overview

The SIA Exam Prep platform uses **Supabase (PostgreSQL)** for data storage with comprehensive Row Level Security (RLS) policies to ensure data privacy and security.

### Key Features

- **Multi-exam support**: Users can prepare for DS, SG, CCTV, and CP exams simultaneously
- **Progress tracking**: Records every question attempt with support for retakes
- **Mock exams**: Complete exam simulations with detailed breakdowns
- **Streak tracking**: Gamification through daily practice streaks
- **Bookmarks**: Save difficult questions for review
- **Session analytics**: Track practice sessions for insights

### Database Statistics

| Table | Estimated Growth | Primary Use |
|-------|------------------|-------------|
| `user_profiles` | Low (1 row per user) | User settings and exam selection |
| `user_progress` | **High** (millions of rows) | Question attempts and answers |
| `bookmarks` | Medium (100s per user) | Saved questions |
| `mock_exam_attempts` | Medium (10s per user) | Exam history |
| `user_streaks` | Low (1 row per user) | Streak tracking |
| `user_sessions` | Medium (100s per user) | Session analytics |

---

## Schema Diagram

```
┌─────────────────┐
│  auth.users     │ (Supabase Auth)
└────────┬────────┘
         │
         │ (1:1)
         ├──────────────────┐
         │                  │
    ┌────▼────────┐    ┌────▼──────────┐
    │user_profiles│    │ user_streaks  │
    └─────────────┘    └───────────────┘
         │
         │ (1:N)
         ├──────────────┬───────────────┬─────────────────┐
         │              │               │                 │
    ┌────▼────────┐ ┌──▼──────────┐ ┌──▼─────────────┐ ┌─▼────────────┐
    │user_progress│ │  bookmarks  │ │mock_exam_attempts│ │user_sessions│
    └─────────────┘ └─────────────┘ └──────────────────┘ └──────────────┘
```

---

## Tables

### 1. user_profiles

**Purpose**: Extends Supabase `auth.users` with application-specific profile data.

**Relationship**: 1:1 with `auth.users`

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, FK to auth.users | User ID (same as auth.users.id) |
| `display_name` | TEXT | nullable | User's display name |
| `avatar_url` | TEXT | nullable | Profile picture URL |
| `active_exams` | exam_type[] | DEFAULT '{}' | Array of active exam slugs |
| `exam_dates` | JSONB | DEFAULT '{}' | Exam dates per exam |
| `preferences` | JSONB | DEFAULT {...} | User preferences |
| `created_at` | TIMESTAMPTZ | NOT NULL | Profile creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update timestamp |

#### Example Data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "display_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "active_exams": ["ds", "sg"],
  "exam_dates": {
    "ds": "2024-03-15",
    "sg": "2024-04-20"
  },
  "preferences": {
    "theme": "dark",
    "notifications_enabled": true,
    "sound_enabled": false,
    "show_explanations": true,
    "daily_goal": 25
  }
}
```

#### Constraints

- `valid_active_exams`: Maximum 4 active exams
- CASCADE delete when user is deleted from auth.users

---

### 2. user_progress

**Purpose**: Track every question attempt. Supports multiple attempts per question (retakes).

**Relationship**: Many-to-one with `auth.users`

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Progress entry ID |
| `user_id` | UUID | NOT NULL, FK to auth.users | User who attempted |
| `exam_slug` | exam_type | NOT NULL | Exam type (ds/sg/cctv/cp) |
| `question_id` | TEXT | NOT NULL | Question identifier |
| `is_correct` | BOOLEAN | NOT NULL | Whether answer was correct |
| `selected_answer` | answer_choice | nullable | User's selected answer (A/B/C/D) |
| `time_spent` | INTEGER | nullable, >= 0 | Seconds spent on question |
| `attempted_at` | TIMESTAMPTZ | NOT NULL | When attempt was made |

#### Question ID Format

```
{exam_slug}-unit{X}-chapter{X.Y}-q{N}

Examples:
- ds-unit2-chapter2.1-q1
- sg-unit1-chapter1.2-q15
- cctv-unit2-chapter2.5-q8
- cp-unit4-chapter4.3-q12
```

#### Example Data

```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "exam_slug": "ds",
  "question_id": "ds-unit2-chapter2.1-q1",
  "is_correct": true,
  "selected_answer": "A",
  "time_spent": 45,
  "attempted_at": "2024-12-07T10:30:00Z"
}
```

#### Important Notes

- **No UNIQUE constraint** on `(user_id, question_id)` - allows retakes
- Use `attempted_at DESC` to get latest attempt
- Use `MIN(attempted_at)` for first attempt statistics
- This table will grow very large - heavily indexed

---

### 3. bookmarks

**Purpose**: Store user-bookmarked questions for later review.

**Relationship**: Many-to-one with `auth.users`

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Bookmark ID |
| `user_id` | UUID | NOT NULL, FK to auth.users | User who bookmarked |
| `exam_slug` | exam_type | NOT NULL | Exam type |
| `question_id` | TEXT | NOT NULL | Question identifier |
| `notes` | TEXT | nullable | User's personal notes |
| `created_at` | TIMESTAMPTZ | NOT NULL | When bookmarked |

#### Constraints

- `UNIQUE(user_id, question_id)`: Cannot bookmark same question twice

#### Example Data

```json
{
  "id": "750e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "exam_slug": "ds",
  "question_id": "ds-unit2-chapter2.4-q12",
  "notes": "Confusing wording on PACE Section 24A - review again",
  "created_at": "2024-12-07T15:22:00Z"
}
```

---

### 4. mock_exam_attempts

**Purpose**: Store complete mock exam sessions with detailed results and breakdown.

**Relationship**: Many-to-one with `auth.users`

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Attempt ID |
| `user_id` | UUID | NOT NULL, FK to auth.users | User who took exam |
| `exam_slug` | exam_type | NOT NULL | Exam type |
| `score` | INTEGER | NOT NULL, 0 <= score <= total | Number of correct answers |
| `total_questions` | INTEGER | NOT NULL, DEFAULT 40 | Total questions in exam |
| `percentage` | DECIMAL(5,2) | NOT NULL, 0-100 | Score percentage |
| `pass_threshold` | DECIMAL(5,2) | DEFAULT 80.0 | Passing percentage |
| `passed` | BOOLEAN | NOT NULL | Whether user passed |
| `time_taken` | INTEGER | nullable, >= 0 | Total time in seconds |
| `questions_breakdown` | JSONB | NOT NULL | Detailed per-question results |
| `started_at` | TIMESTAMPTZ | NOT NULL | Exam start time |
| `completed_at` | TIMESTAMPTZ | NOT NULL, >= started_at | Exam completion time |

#### Questions Breakdown Structure

```json
[
  {
    "question_id": "ds-unit2-chapter2.1-q1",
    "selected_answer": "A",
    "is_correct": true,
    "time_spent": 45
  },
  {
    "question_id": "ds-unit3-chapter3.2-q8",
    "selected_answer": "C",
    "is_correct": false,
    "time_spent": 62
  }
  // ... 38 more questions for a 40-question exam
]
```

#### Example Data

```json
{
  "id": "850e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "exam_slug": "ds",
  "score": 34,
  "total_questions": 40,
  "percentage": 85.00,
  "pass_threshold": 80.00,
  "passed": true,
  "time_taken": 2400,
  "questions_breakdown": [...],
  "started_at": "2024-12-07T09:00:00Z",
  "completed_at": "2024-12-07T09:40:00Z"
}
```

---

### 5. user_streaks

**Purpose**: Track daily practice streaks for gamification.

**Relationship**: 1:1 with `auth.users`

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Streak record ID |
| `user_id` | UUID | NOT NULL, UNIQUE, FK to auth.users | User ID |
| `current_streak` | INTEGER | NOT NULL, >= 0 | Current consecutive days |
| `longest_streak` | INTEGER | NOT NULL, >= current_streak | All-time best streak |
| `last_activity_date` | DATE | NOT NULL | Last practice date |
| `total_days_active` | INTEGER | NOT NULL, >= 0 | Total days with activity |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update |

#### Constraints

- `UNIQUE(user_id)`: One streak record per user
- `longest_streak >= current_streak`

#### Example Data

```json
{
  "id": "950e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "current_streak": 7,
  "longest_streak": 21,
  "last_activity_date": "2024-12-07",
  "total_days_active": 45,
  "updated_at": "2024-12-07T18:30:00Z"
}
```

---

### 6. user_sessions

**Purpose**: Group practice sessions for analytics (optional but recommended).

**Relationship**: Many-to-one with `auth.users`

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Session ID |
| `user_id` | UUID | NOT NULL, FK to auth.users | User ID |
| `exam_slug` | exam_type | NOT NULL | Exam type |
| `session_type` | session_type | DEFAULT 'practice' | Session type |
| `questions_attempted` | INTEGER | NOT NULL, >= 0 | Questions in session |
| `questions_correct` | INTEGER | NOT NULL, <= attempted | Correct answers |
| `started_at` | TIMESTAMPTZ | NOT NULL | Session start |
| `ended_at` | TIMESTAMPTZ | nullable, >= started_at | Session end |
| `duration` | INTEGER | nullable, >= 0 | Duration in seconds |

#### Session Types

- `practice`: Regular practice mode
- `review`: Reviewing bookmarked/incorrect questions
- `bookmarks`: Practicing only bookmarked questions
- `mock_exam`: Mock exam session (also recorded in mock_exam_attempts)

---

## Indexes

### Critical Indexes (High Performance Impact)

#### user_progress

```sql
-- Most frequently used
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_user_exam ON user_progress(user_id, exam_slug);

-- Latest attempt queries
CREATE INDEX idx_user_progress_latest_attempt ON user_progress(
    user_id,
    question_id,
    attempted_at DESC
) INCLUDE (is_correct, selected_answer, time_spent);

-- Recent activity (partial index for performance)
CREATE INDEX idx_user_progress_recent ON user_progress(user_id, attempted_at DESC)
WHERE attempted_at > NOW() - INTERVAL '90 days';
```

#### mock_exam_attempts

```sql
-- Exam history
CREATE INDEX idx_mock_attempts_user_exam_completed ON mock_exam_attempts(
    user_id,
    exam_slug,
    completed_at DESC
);

-- JSONB queries
CREATE INDEX idx_mock_attempts_breakdown ON mock_exam_attempts
USING GIN (questions_breakdown);
```

#### bookmarks

```sql
-- Fetching user bookmarks
CREATE INDEX idx_bookmarks_user_exam ON bookmarks(user_id, exam_slug);
```

---

## Functions

### 1. calculate_accuracy(user_id, exam_slug)

Calculate user's accuracy percentage based on latest attempts.

**Parameters:**
- `p_user_id` (UUID): User ID
- `p_exam_slug` (exam_type, optional): Specific exam or NULL for all exams

**Returns:** DECIMAL (0-100)

**Usage:**

```sql
-- Get overall accuracy
SELECT calculate_accuracy('550e8400-e29b-41d4-a716-446655440000');

-- Get DS exam accuracy
SELECT calculate_accuracy('550e8400-e29b-41d4-a716-446655440000', 'ds');
```

**Logic:**
- Gets latest attempt for each question
- Calculates percentage of correct answers
- Returns 0 if no attempts found

---

### 2. update_streak(user_id)

Update user's streak based on current activity.

**Parameters:**
- `p_user_id` (UUID): User ID

**Returns:** VOID

**Usage:**

```sql
-- Manually update streak (auto-triggered on new progress)
SELECT update_streak('550e8400-e29b-41d4-a716-446655440000');
```

**Logic:**
1. Check if streak record exists (create if not)
2. If practiced today, do nothing
3. If practiced yesterday, increment streak
4. If missed days, reset streak to 1
5. Update longest_streak if current exceeds it

**Automatic Trigger:** Called automatically when user completes a question.

---

### 3. get_progress_stats(user_id, exam_slug)

Get comprehensive progress statistics for a user and exam.

**Parameters:**
- `p_user_id` (UUID): User ID
- `p_exam_slug` (exam_type): Exam type

**Returns:** JSONB

**Usage:**

```sql
SELECT get_progress_stats('550e8400-e29b-41d4-a716-446655440000', 'ds');
```

**Returns:**

```json
{
  "total_questions_attempted": 125,
  "total_attempts": 187,
  "correct_on_first_try": 98,
  "overall_accuracy": 78.45,
  "average_time_per_question": 52,
  "total_time_spent": 9724,
  "last_activity": "2024-12-07T18:30:00Z"
}
```

---

## Row Level Security

All tables have RLS enabled with policies ensuring users can only access their own data.

### Policy Pattern

For each table, four policies are created:

```sql
-- Example for user_progress
CREATE POLICY "Users can view own progress"
    ON user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON user_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
    ON user_progress FOR DELETE
    USING (auth.uid() = user_id);
```

### Security Guarantees

- Users **cannot** view other users' data
- Users **cannot** modify other users' data
- All queries automatically filtered by `auth.uid()`
- Service role bypasses RLS (use carefully)

---

## Common Queries

### Get User's Latest Attempt Per Question

```sql
SELECT DISTINCT ON (question_id)
    question_id,
    is_correct,
    selected_answer,
    time_spent,
    attempted_at
FROM user_progress
WHERE user_id = 'USER_ID'
    AND exam_slug = 'ds'
ORDER BY question_id, attempted_at DESC;
```

### Get User's Overall Progress for an Exam

```sql
SELECT
    COUNT(DISTINCT question_id) as questions_attempted,
    COUNT(*) FILTER (WHERE is_correct = true) as correct_answers,
    COUNT(DISTINCT question_id) FILTER (WHERE is_correct = true) as unique_correct,
    ROUND(
        COUNT(*) FILTER (WHERE is_correct = true)::DECIMAL /
        COUNT(*)::DECIMAL * 100,
        2
    ) as accuracy_percentage
FROM user_progress
WHERE user_id = 'USER_ID'
    AND exam_slug = 'ds';
```

### Get Mock Exam History

```sql
SELECT
    id,
    score,
    total_questions,
    percentage,
    passed,
    time_taken,
    completed_at
FROM mock_exam_attempts
WHERE user_id = 'USER_ID'
    AND exam_slug = 'ds'
ORDER BY completed_at DESC
LIMIT 10;
```

### Get Bookmarked Questions

```sql
SELECT
    question_id,
    notes,
    created_at
FROM bookmarks
WHERE user_id = 'USER_ID'
    AND exam_slug = 'ds'
ORDER BY created_at DESC;
```

### Get User's Current Streak

```sql
SELECT
    current_streak,
    longest_streak,
    total_days_active
FROM user_streaks
WHERE user_id = 'USER_ID';
```

### Get Questions User Got Wrong (for review)

```sql
SELECT DISTINCT ON (question_id)
    question_id,
    selected_answer,
    attempted_at
FROM user_progress
WHERE user_id = 'USER_ID'
    AND exam_slug = 'ds'
    AND is_correct = false
ORDER BY question_id, attempted_at DESC;
```

### Calculate Weekly Activity

```sql
SELECT
    DATE(attempted_at) as date,
    COUNT(DISTINCT question_id) as questions_attempted,
    COUNT(*) FILTER (WHERE is_correct = true) as correct_answers
FROM user_progress
WHERE user_id = 'USER_ID'
    AND attempted_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(attempted_at)
ORDER BY date DESC;
```

---

## Setup Instructions

### Local Development with Supabase CLI

#### 1. Install Supabase CLI

```bash
npm install -g supabase
```

#### 2. Initialize Supabase Project

```bash
cd /path/to/sia-door-supervisor
supabase init
```

#### 3. Start Local Supabase

```bash
supabase start
```

This will start:
- PostgreSQL database
- Studio UI (http://localhost:54323)
- Auth server
- Storage server
- Realtime server

#### 4. Apply Schema

**Option A: Using migration file**

```bash
supabase db reset
# This applies all migrations in supabase/migrations/
```

**Option B: Using schema.sql directly**

```bash
psql -h localhost -p 54322 -U postgres -d postgres < supabase/schema.sql
```

#### 5. Access Studio UI

Open http://localhost:54323 to view:
- Tables and data
- Run SQL queries
- Manage auth users
- View logs

---

### Production Setup (Supabase Cloud)

#### 1. Create Supabase Project

Visit https://app.supabase.com and create a new project.

#### 2. Link Local Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

#### 3. Push Migration

```bash
supabase db push
```

#### 4. Verify in Dashboard

Visit your project dashboard:
- Navigate to **Table Editor** to see tables
- Check **Database** > **Roles** for RLS policies
- Test queries in **SQL Editor**

---

## Migration Guide

### Creating New Migrations

```bash
supabase migration new your_migration_name
```

This creates a new file: `supabase/migrations/YYYYMMDDHHMMSS_your_migration_name.sql`

### Migration Best Practices

1. **Always test locally first**
   ```bash
   supabase db reset  # Apply all migrations
   ```

2. **Make migrations idempotent**
   ```sql
   CREATE TABLE IF NOT EXISTS ...
   CREATE INDEX IF NOT EXISTS ...
   ```

3. **Include rollback instructions**
   ```sql
   -- Rollback: DROP TABLE user_sessions CASCADE;
   ```

4. **Version your schema**
   ```sql
   INSERT INTO schema_version (version, description)
   VALUES ('1.1.0', 'Added analytics tables');
   ```

### Applying Migrations in Production

```bash
# Review migration before applying
supabase db diff

# Push to production
supabase db push
```

---

## Performance Optimization

### Query Performance Tips

1. **Always filter by indexed columns**
   ```sql
   -- Good (uses index)
   WHERE user_id = 'xxx' AND exam_slug = 'ds'

   -- Bad (full table scan)
   WHERE display_name LIKE '%John%'
   ```

2. **Use DISTINCT ON instead of GROUP BY for "latest" queries**
   ```sql
   -- Faster
   SELECT DISTINCT ON (question_id) *
   FROM user_progress
   ORDER BY question_id, attempted_at DESC;

   -- Slower
   SELECT * FROM (
       SELECT *, ROW_NUMBER() OVER (PARTITION BY question_id ORDER BY attempted_at DESC) as rn
       FROM user_progress
   ) WHERE rn = 1;
   ```

3. **Limit result sets**
   ```sql
   SELECT * FROM user_progress
   WHERE user_id = 'xxx'
   ORDER BY attempted_at DESC
   LIMIT 100;  -- Don't fetch unbounded results
   ```

4. **Use partial indexes for common filters**
   ```sql
   -- Already created for recent activity
   CREATE INDEX ... WHERE attempted_at > NOW() - INTERVAL '90 days';
   ```

### Monitoring Performance

```sql
-- Check slow queries
SELECT
    query,
    mean_exec_time,
    calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Database Maintenance

```sql
-- Update statistics (run weekly)
ANALYZE;

-- Rebuild indexes (run monthly)
REINDEX DATABASE postgres;

-- Check table bloat
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Backup and Maintenance

### Automated Backups (Supabase Cloud)

Supabase automatically backs up your database:
- **Point-in-time recovery**: 7 days (Pro plan)
- **Daily backups**: Retained for 30 days

### Manual Backups

#### Export Data

```bash
# Dump entire database
supabase db dump -f backup.sql

# Dump specific tables
pg_dump -h localhost -p 54322 -U postgres \
    -t user_progress -t mock_exam_attempts \
    > important_tables_backup.sql
```

#### Restore from Backup

```bash
psql -h localhost -p 54322 -U postgres -d postgres < backup.sql
```

### Data Retention Policy

Consider implementing data retention:

```sql
-- Archive old progress data (>1 year)
CREATE TABLE user_progress_archive AS
SELECT * FROM user_progress
WHERE attempted_at < NOW() - INTERVAL '1 year';

-- Delete archived data
DELETE FROM user_progress
WHERE attempted_at < NOW() - INTERVAL '1 year';
```

---

## Troubleshooting

### RLS Policies Not Working

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- View active policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Slow Queries

```sql
-- Enable query timing
EXPLAIN ANALYZE
SELECT * FROM user_progress
WHERE user_id = 'xxx';
```

### Missing Indexes

```sql
-- Check for sequential scans (should use indexes)
SELECT
    schemaname,
    tablename,
    seq_scan,
    idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

**Last Updated:** 2025-12-07
**Schema Version:** 1.0.0
**Author:** SIA Exam Prep Team
