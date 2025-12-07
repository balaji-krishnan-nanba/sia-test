# Database Schema - Entity Relationship Diagram

## Visual Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        auth.users                                │
│                     (Supabase Auth)                              │
│                                                                  │
│  - id: UUID (PK)                                                │
│  - email                                                         │
│  - encrypted_password                                            │
│  - ... (managed by Supabase)                                    │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ (1:1 / 1:Many relationships)
                        │
        ┌───────────────┼───────────────────────────┐
        │               │                           │
        │               │                           │
┌───────▼──────┐  ┌─────▼──────┐           ┌───────▼───────┐
│user_profiles │  │user_streaks│           │               │
│──────────────│  │────────────│           │  (1:Many)     │
│id (PK, FK)   │  │id (PK)     │           │               │
│display_name  │  │user_id (FK)│           │               │
│avatar_url    │  │            │           │               │
│active_exams[]│  │current_    │           │               │
│exam_dates    │  │ streak     │           │               │
│preferences   │  │longest_    │           │               │
│created_at    │  │ streak     │           │               │
│updated_at    │  │last_       │     ┌─────▼──────────┐
└──────────────┘  │ activity   │     │user_progress   │
                  │ _date      │     │────────────────│
                  │total_days_ │     │id (PK)         │
                  │ active     │     │user_id (FK)    │
                  │updated_at  │     │exam_slug       │
                  └────────────┘     │question_id     │
                                     │is_correct      │
                                     │selected_answer │
                                     │time_spent      │
                                     │attempted_at    │
                                     └────────────────┘
                        │
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        │               │                │
┌───────▼────────┐ ┌────▼──────────┐ ┌──▼──────────────┐
│bookmarks       │ │mock_exam_     │ │user_sessions    │
│────────────────│ │ attempts      │ │─────────────────│
│id (PK)         │ │───────────────│ │id (PK)          │
│user_id (FK)    │ │id (PK)        │ │user_id (FK)     │
│exam_slug       │ │user_id (FK)   │ │exam_slug        │
│question_id     │ │exam_slug      │ │session_type     │
│notes           │ │score          │ │questions_       │
│created_at      │ │total_questions│ │ attempted       │
└────────────────┘ │percentage     │ │questions_correct│
                   │pass_threshold │ │started_at       │
                   │passed         │ │ended_at         │
                   │time_taken     │ │duration         │
                   │questions_     │ └─────────────────┘
                   │ breakdown     │
                   │started_at     │
                   │completed_at   │
                   └───────────────┘
```

## Relationships

### One-to-One (1:1)

- **auth.users → user_profiles**: Each user has exactly one profile
- **auth.users → user_streaks**: Each user has exactly one streak record

### One-to-Many (1:N)

- **auth.users → user_progress**: One user can have many question attempts
- **auth.users → bookmarks**: One user can bookmark many questions
- **auth.users → mock_exam_attempts**: One user can take many mock exams
- **auth.users → user_sessions**: One user can have many practice sessions

## Foreign Key Constraints

All tables use `ON DELETE CASCADE` to ensure data integrity:

```sql
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

This means:
- When a user is deleted from `auth.users`, all their data is automatically deleted
- Maintains referential integrity
- Supports GDPR right to erasure

## Indexes Summary

### Primary Indexes (Automatic)

Every table has a primary key with automatic index:
- `user_profiles.id`
- `user_progress.id`
- `bookmarks.id`
- `mock_exam_attempts.id`
- `user_streaks.id`
- `user_sessions.id`

### Foreign Key Indexes

Critical for join performance:
- All `user_id` columns are indexed
- Composite indexes for common query patterns

### Specialized Indexes

1. **GIN Indexes** (for array/JSONB columns):
   - `user_profiles.active_exams` - Array operations
   - `mock_exam_attempts.questions_breakdown` - JSONB queries

2. **Composite Indexes** (multi-column):
   - `(user_id, exam_slug)` - Exam-specific queries
   - `(user_id, question_id, attempted_at DESC)` - Latest attempts

3. **Partial Indexes** (filtered):
   - `user_progress` WHERE `attempted_at > NOW() - 90 days` - Recent activity

## Data Types

### Custom Enums

```sql
-- Exam types
CREATE TYPE exam_type AS ENUM ('ds', 'sg', 'cctv', 'cp');

-- Session types
CREATE TYPE session_type AS ENUM ('practice', 'review', 'bookmarks', 'mock_exam');

-- Answer choices
CREATE TYPE answer_choice AS ENUM ('A', 'B', 'C', 'D');
```

### JSONB Structures

**user_profiles.exam_dates:**
```json
{
  "ds": "2024-03-15",
  "sg": "2024-04-20"
}
```

**user_profiles.preferences:**
```json
{
  "theme": "light",
  "notifications_enabled": true,
  "sound_enabled": true,
  "show_explanations": true,
  "daily_goal": 20
}
```

**mock_exam_attempts.questions_breakdown:**
```json
[
  {
    "question_id": "ds-unit2-chapter2.1-q1",
    "selected_answer": "A",
    "is_correct": true,
    "time_spent": 45
  },
  ...
]
```

## Row Level Security (RLS)

Every table has 4 policies:

1. **SELECT**: `auth.uid() = user_id`
2. **INSERT**: `auth.uid() = user_id`
3. **UPDATE**: `auth.uid() = user_id`
4. **DELETE**: `auth.uid() = user_id`

This ensures users can only access their own data.

## Triggers

### Auto-Update Triggers

- `user_profiles.updated_at` - Auto-updates on modification
- `user_streaks.updated_at` - Auto-updates on modification

### Business Logic Triggers

- **Automatic Streak Update**: When a user completes a question (`user_progress` INSERT), the `update_streak()` function is automatically called

## Database Functions

### 1. calculate_accuracy(user_id, exam_slug)

Returns accuracy percentage based on latest attempts.

**Example:**
```sql
SELECT calculate_accuracy(auth.uid(), 'ds');
-- Returns: 85.50
```

### 2. update_streak(user_id)

Updates user's daily streak.

**Logic:**
- If practiced today: do nothing
- If practiced yesterday: increment streak
- If gap > 1 day: reset streak to 1

**Example:**
```sql
SELECT update_streak(auth.uid());
```

### 3. get_progress_stats(user_id, exam_slug)

Returns comprehensive statistics.

**Example:**
```sql
SELECT get_progress_stats(auth.uid(), 'ds');
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

## Helper Views

### latest_question_attempts

Gets the latest attempt for each question per user.

```sql
SELECT * FROM latest_question_attempts
WHERE user_id = auth.uid()
  AND exam_slug = 'ds';
```

### user_accuracy_by_exam

Calculates accuracy statistics per user per exam.

```sql
SELECT * FROM user_accuracy_by_exam
WHERE user_id = auth.uid();
```

## Performance Characteristics

| Table | Expected Size | Query Pattern | Index Strategy |
|-------|--------------|---------------|----------------|
| user_profiles | Small (1/user) | PK lookups | Primary key only |
| user_progress | **Very Large** (1000s/user) | Range queries, Latest attempts | Heavy indexing |
| bookmarks | Medium (100s/user) | List queries | User + exam indexes |
| mock_exam_attempts | Medium (10s/user) | History queries | User + exam + date |
| user_streaks | Small (1/user) | PK lookups | Primary + unique user_id |
| user_sessions | Medium (100s/user) | Recent history | User + date indexes |

## Scalability Considerations

### Current (MVP) Strategy

- Single database instance
- Standard B-tree indexes
- RLS for security

### Future Optimizations

1. **Partitioning** `user_progress` by:
   - User ID hash
   - Date ranges (monthly/yearly)

2. **Materialized Views** for:
   - Dashboard statistics
   - Leaderboards (if implemented)

3. **Read Replicas** for:
   - Reporting queries
   - Analytics

4. **Archiving** strategy:
   - Move data > 1 year old to archive tables
   - Keep active data lean

## Data Retention

Suggested retention policy:

- **user_progress**: Keep all (critical for analytics)
- **mock_exam_attempts**: Keep all (exam history)
- **bookmarks**: Keep all (user-managed)
- **user_sessions**: Archive after 1 year
- **user_streaks**: Keep current only

## Migration Strategy

All schema changes should be versioned migrations:

```
supabase/migrations/
├── 001_initial_schema.sql       ← Current
├── 002_add_feature_x.sql        ← Future
├── 003_optimize_indexes.sql     ← Future
└── ...
```

Each migration should:
- Be idempotent (use `IF NOT EXISTS`)
- Include rollback comments
- Update `schema_version` table
- Be tested locally first

---

**Schema Version:** 1.0.0
**Last Updated:** 2025-12-07
**Total Tables:** 6
**Total Indexes:** 20+
**Total Functions:** 3
**Total Views:** 2
**Total RLS Policies:** 24 (4 per table × 6 tables)
