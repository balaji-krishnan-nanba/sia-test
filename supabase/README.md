# Supabase Database Setup

This directory contains the database schema and migrations for the SIA Exam Prep platform.

## Directory Structure

```
supabase/
├── README.md                    # This file
├── schema.sql                   # Complete database schema (for reference)
└── migrations/
    └── 001_initial_schema.sql   # Initial migration
```

## Quick Start

### 1. Local Development

Install Supabase CLI:

```bash
npm install -g supabase
```

Start local Supabase:

```bash
supabase start
```

Apply migrations:

```bash
supabase db reset
```

Access Studio UI at: http://localhost:54323

### 2. Production Deployment

Link to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Push migrations:

```bash
supabase db push
```

## Schema Overview

The database includes:

- **6 tables**: user_profiles, user_progress, bookmarks, mock_exam_attempts, user_streaks, user_sessions
- **3 custom types**: exam_type, session_type, answer_choice
- **3 helper functions**: calculate_accuracy, update_streak, get_progress_stats
- **2 views**: latest_question_attempts, user_accuracy_by_exam
- **RLS policies**: Full Row Level Security on all tables
- **Comprehensive indexes**: Optimized for common query patterns

## Environment Variables

Add these to your `.env.local`:

```env
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing the Schema

Run these queries in Supabase Studio SQL Editor to verify:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## Documentation

See `/docs/DATABASE.md` for comprehensive documentation including:
- Detailed table schemas
- Common queries
- Performance optimization
- Backup and maintenance

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Database Documentation](../docs/DATABASE.md)
- [Project README](../README.md)
