-- ============================================================================
-- Example Queries for SIA Exam Prep Platform
-- ============================================================================
-- This file contains example SQL queries for common operations.
-- Use these as a reference when building your application.
-- ============================================================================

-- ============================================================================
-- USER PROFILE OPERATIONS
-- ============================================================================

-- Create/Update User Profile (called on signup)
-- Note: This should be called via Supabase client, not direct SQL in production
INSERT INTO user_profiles (id, display_name, active_exams, exam_dates, preferences)
VALUES (
    auth.uid(),
    'John Doe',
    ARRAY['ds', 'sg']::exam_type[],
    '{"ds": "2024-03-15", "sg": "2024-04-20"}'::jsonb,
    '{"theme": "dark", "daily_goal": 25}'::jsonb
)
ON CONFLICT (id)
DO UPDATE SET
    display_name = EXCLUDED.display_name,
    active_exams = EXCLUDED.active_exams,
    exam_dates = EXCLUDED.exam_dates,
    preferences = EXCLUDED.preferences,
    updated_at = NOW();

-- Get User Profile
SELECT * FROM user_profiles WHERE id = auth.uid();

-- Update User Preferences
UPDATE user_profiles
SET preferences = jsonb_set(
    preferences,
    '{theme}',
    '"light"'
)
WHERE id = auth.uid();

-- Add an Exam to Active Exams
UPDATE user_profiles
SET
    active_exams = active_exams || 'cctv'::exam_type,
    exam_dates = exam_dates || '{"cctv": "2024-05-01"}'::jsonb
WHERE id = auth.uid();

-- ============================================================================
-- QUESTION PROGRESS OPERATIONS
-- ============================================================================

-- Record a Question Attempt
INSERT INTO user_progress (
    user_id,
    exam_slug,
    question_id,
    is_correct,
    selected_answer,
    time_spent
)
VALUES (
    auth.uid(),
    'ds'::exam_type,
    'ds-unit2-chapter2.1-q1',
    true,
    'A'::answer_choice,
    45
);

-- Get All Attempts for a Specific Question
SELECT
    is_correct,
    selected_answer,
    time_spent,
    attempted_at
FROM user_progress
WHERE user_id = auth.uid()
    AND question_id = 'ds-unit2-chapter2.1-q1'
ORDER BY attempted_at DESC;

-- Get Latest Attempt for Each Question (Current Progress)
SELECT DISTINCT ON (question_id)
    question_id,
    is_correct,
    selected_answer,
    time_spent,
    attempted_at
FROM user_progress
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
ORDER BY question_id, attempted_at DESC;

-- Get Only Incorrect Questions (for review)
SELECT DISTINCT ON (question_id)
    question_id,
    selected_answer,
    attempted_at
FROM user_progress
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
    AND is_correct = false
ORDER BY question_id, attempted_at DESC;

-- Get Questions Answered on First Try
SELECT DISTINCT question_id
FROM (
    SELECT
        question_id,
        is_correct,
        ROW_NUMBER() OVER (PARTITION BY question_id ORDER BY attempted_at) as attempt_number
    FROM user_progress
    WHERE user_id = auth.uid()
        AND exam_slug = 'ds'::exam_type
) first_attempts
WHERE attempt_number = 1 AND is_correct = true;

-- Calculate User's Accuracy for an Exam
SELECT
    COUNT(DISTINCT question_id) as total_questions_attempted,
    COUNT(DISTINCT question_id) FILTER (WHERE is_correct = true) as questions_correct,
    ROUND(
        COUNT(DISTINCT question_id) FILTER (WHERE is_correct = true)::DECIMAL /
        COUNT(DISTINCT question_id)::DECIMAL * 100,
        2
    ) as accuracy_percentage
FROM (
    SELECT DISTINCT ON (question_id)
        question_id,
        is_correct
    FROM user_progress
    WHERE user_id = auth.uid()
        AND exam_slug = 'ds'::exam_type
    ORDER BY question_id, attempted_at DESC
) latest_attempts;

-- Get Daily Activity for the Last 7 Days
SELECT
    DATE(attempted_at) as date,
    COUNT(DISTINCT question_id) as questions_attempted,
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE is_correct = true) as correct_answers,
    ROUND(
        COUNT(*) FILTER (WHERE is_correct = true)::DECIMAL /
        COUNT(*)::DECIMAL * 100,
        2
    ) as accuracy_percentage
FROM user_progress
WHERE user_id = auth.uid()
    AND attempted_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(attempted_at)
ORDER BY date DESC;

-- Get Average Time Spent Per Question
SELECT
    ROUND(AVG(time_spent), 0) as avg_time_seconds,
    ROUND(AVG(time_spent) / 60.0, 1) as avg_time_minutes
FROM user_progress
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
    AND time_spent IS NOT NULL;

-- ============================================================================
-- BOOKMARK OPERATIONS
-- ============================================================================

-- Add a Bookmark
INSERT INTO bookmarks (user_id, exam_slug, question_id, notes)
VALUES (
    auth.uid(),
    'ds'::exam_type,
    'ds-unit2-chapter2.4-q12',
    'Confusing wording - review again'
)
ON CONFLICT (user_id, question_id) DO NOTHING;

-- Update Bookmark Notes
UPDATE bookmarks
SET notes = 'Finally understand this one!'
WHERE user_id = auth.uid()
    AND question_id = 'ds-unit2-chapter2.4-q12';

-- Remove a Bookmark
DELETE FROM bookmarks
WHERE user_id = auth.uid()
    AND question_id = 'ds-unit2-chapter2.4-q12';

-- Get All Bookmarks for an Exam
SELECT
    question_id,
    notes,
    created_at
FROM bookmarks
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
ORDER BY created_at DESC;

-- Get Bookmarks with Progress Info
SELECT
    b.question_id,
    b.notes,
    b.created_at,
    p.is_correct as last_attempt_correct,
    p.attempted_at as last_attempted
FROM bookmarks b
LEFT JOIN LATERAL (
    SELECT is_correct, attempted_at
    FROM user_progress
    WHERE user_id = b.user_id
        AND question_id = b.question_id
    ORDER BY attempted_at DESC
    LIMIT 1
) p ON true
WHERE b.user_id = auth.uid()
    AND b.exam_slug = 'ds'::exam_type
ORDER BY b.created_at DESC;

-- ============================================================================
-- MOCK EXAM OPERATIONS
-- ============================================================================

-- Record a Mock Exam Attempt
INSERT INTO mock_exam_attempts (
    user_id,
    exam_slug,
    score,
    total_questions,
    percentage,
    pass_threshold,
    passed,
    time_taken,
    questions_breakdown,
    started_at,
    completed_at
)
VALUES (
    auth.uid(),
    'ds'::exam_type,
    34,
    40,
    85.00,
    80.00,
    true,
    2400, -- 40 minutes in seconds
    '[
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
    ]'::jsonb,
    NOW() - INTERVAL '40 minutes',
    NOW()
);

-- Get Mock Exam History for an Exam
SELECT
    id,
    score,
    total_questions,
    percentage,
    passed,
    time_taken,
    completed_at
FROM mock_exam_attempts
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
ORDER BY completed_at DESC
LIMIT 10;

-- Get Latest Mock Exam Result
SELECT *
FROM mock_exam_attempts
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
ORDER BY completed_at DESC
LIMIT 1;

-- Calculate Mock Exam Average Score
SELECT
    COUNT(*) as total_attempts,
    ROUND(AVG(percentage), 2) as average_percentage,
    ROUND(AVG(score), 1) as average_score,
    COUNT(*) FILTER (WHERE passed = true) as passed_count,
    MAX(percentage) as best_score,
    MIN(percentage) as worst_score
FROM mock_exam_attempts
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type;

-- Get Mock Exam Progress Over Time
SELECT
    completed_at::DATE as date,
    percentage,
    passed,
    time_taken
FROM mock_exam_attempts
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
ORDER BY completed_at ASC;

-- Analyze Questions Frequently Missed in Mock Exams
SELECT
    elem->>'question_id' as question_id,
    COUNT(*) as times_attempted,
    COUNT(*) FILTER (WHERE (elem->>'is_correct')::boolean = false) as times_wrong,
    ROUND(
        COUNT(*) FILTER (WHERE (elem->>'is_correct')::boolean = false)::DECIMAL /
        COUNT(*)::DECIMAL * 100,
        2
    ) as error_rate
FROM mock_exam_attempts,
    jsonb_array_elements(questions_breakdown) as elem
WHERE user_id = auth.uid()
    AND exam_slug = 'ds'::exam_type
GROUP BY elem->>'question_id'
HAVING COUNT(*) FILTER (WHERE (elem->>'is_correct')::boolean = false) > 0
ORDER BY error_rate DESC, times_wrong DESC
LIMIT 20;

-- ============================================================================
-- STREAK OPERATIONS
-- ============================================================================

-- Get Current Streak
SELECT
    current_streak,
    longest_streak,
    total_days_active,
    last_activity_date
FROM user_streaks
WHERE user_id = auth.uid();

-- Manually Update Streak (normally auto-triggered)
SELECT update_streak(auth.uid());

-- Check if User Practiced Today
SELECT
    CASE
        WHEN last_activity_date = CURRENT_DATE THEN true
        ELSE false
    END as practiced_today
FROM user_streaks
WHERE user_id = auth.uid();

-- Get Streak History (approximation)
SELECT
    DATE(attempted_at) as date,
    COUNT(DISTINCT question_id) as questions_attempted
FROM user_progress
WHERE user_id = auth.uid()
    AND attempted_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(attempted_at)
ORDER BY date DESC;

-- ============================================================================
-- SESSION OPERATIONS
-- ============================================================================

-- Start a Practice Session
INSERT INTO user_sessions (
    user_id,
    exam_slug,
    session_type,
    started_at
)
VALUES (
    auth.uid(),
    'ds'::exam_type,
    'practice'::session_type,
    NOW()
)
RETURNING id;

-- End a Practice Session
UPDATE user_sessions
SET
    ended_at = NOW(),
    duration = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER,
    questions_attempted = 15,
    questions_correct = 12
WHERE id = 'SESSION_ID'
    AND user_id = auth.uid();

-- Get Recent Sessions
SELECT
    id,
    exam_slug,
    session_type,
    questions_attempted,
    questions_correct,
    ROUND(
        CASE
            WHEN questions_attempted > 0
            THEN (questions_correct::DECIMAL / questions_attempted::DECIMAL * 100)
            ELSE 0
        END,
        2
    ) as accuracy,
    duration,
    started_at,
    ended_at
FROM user_sessions
WHERE user_id = auth.uid()
ORDER BY started_at DESC
LIMIT 20;

-- Calculate Session Statistics
SELECT
    exam_slug,
    session_type,
    COUNT(*) as session_count,
    SUM(questions_attempted) as total_questions,
    SUM(questions_correct) as total_correct,
    ROUND(AVG(duration), 0) as avg_duration_seconds,
    ROUND(
        SUM(questions_correct)::DECIMAL /
        NULLIF(SUM(questions_attempted), 0)::DECIMAL * 100,
        2
    ) as overall_accuracy
FROM user_sessions
WHERE user_id = auth.uid()
    AND ended_at IS NOT NULL
GROUP BY exam_slug, session_type
ORDER BY exam_slug, session_type;

-- ============================================================================
-- DASHBOARD QUERIES
-- ============================================================================

-- Complete Dashboard Statistics for an Exam
WITH latest_attempts AS (
    SELECT DISTINCT ON (question_id)
        question_id,
        is_correct,
        time_spent,
        attempted_at
    FROM user_progress
    WHERE user_id = auth.uid()
        AND exam_slug = 'ds'::exam_type
    ORDER BY question_id, attempted_at DESC
),
recent_activity AS (
    SELECT
        DATE(attempted_at) as date,
        COUNT(DISTINCT question_id) as questions
    FROM user_progress
    WHERE user_id = auth.uid()
        AND exam_slug = 'ds'::exam_type
        AND attempted_at > NOW() - INTERVAL '7 days'
    GROUP BY DATE(attempted_at)
)
SELECT
    (SELECT COUNT(*) FROM latest_attempts) as total_questions_attempted,
    (SELECT COUNT(*) FROM latest_attempts WHERE is_correct = true) as questions_correct,
    (SELECT ROUND(AVG(time_spent), 0) FROM latest_attempts WHERE time_spent IS NOT NULL) as avg_time_per_question,
    (SELECT MAX(attempted_at) FROM latest_attempts) as last_practice_time,
    (SELECT current_streak FROM user_streaks WHERE user_id = auth.uid()) as current_streak,
    (SELECT COUNT(*) FROM mock_exam_attempts WHERE user_id = auth.uid() AND exam_slug = 'ds'::exam_type) as mock_exams_taken,
    (SELECT COUNT(*) FROM bookmarks WHERE user_id = auth.uid() AND exam_slug = 'ds'::exam_type) as bookmarks_count,
    (SELECT json_agg(json_build_object('date', date, 'questions', questions) ORDER BY date DESC)
     FROM recent_activity) as weekly_activity;

-- ============================================================================
-- UTILITY QUERIES
-- ============================================================================

-- Delete All User Data (GDPR compliance)
-- WARNING: This will delete all user data. Use with caution!
DO $$
BEGIN
    DELETE FROM user_progress WHERE user_id = auth.uid();
    DELETE FROM bookmarks WHERE user_id = auth.uid();
    DELETE FROM mock_exam_attempts WHERE user_id = auth.uid();
    DELETE FROM user_streaks WHERE user_id = auth.uid();
    DELETE FROM user_sessions WHERE user_id = auth.uid();
    DELETE FROM user_profiles WHERE id = auth.uid();
END $$;

-- Export User Data (GDPR data portability)
SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(user_profiles.*) FROM user_profiles WHERE id = auth.uid()),
    'progress', (SELECT jsonb_agg(row_to_json(user_progress.*)) FROM user_progress WHERE user_id = auth.uid()),
    'bookmarks', (SELECT jsonb_agg(row_to_json(bookmarks.*)) FROM bookmarks WHERE user_id = auth.uid()),
    'mock_exams', (SELECT jsonb_agg(row_to_json(mock_exam_attempts.*)) FROM mock_exam_attempts WHERE user_id = auth.uid()),
    'streaks', (SELECT row_to_json(user_streaks.*) FROM user_streaks WHERE user_id = auth.uid()),
    'sessions', (SELECT jsonb_agg(row_to_json(user_sessions.*)) FROM user_sessions WHERE user_id = auth.uid())
) as user_data_export;

-- Check Database Size
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- USING HELPER FUNCTIONS
-- ============================================================================

-- Calculate User Accuracy
SELECT calculate_accuracy(auth.uid()); -- All exams
SELECT calculate_accuracy(auth.uid(), 'ds'::exam_type); -- Specific exam

-- Get Progress Stats
SELECT get_progress_stats(auth.uid(), 'ds'::exam_type);

-- Update Streak
SELECT update_streak(auth.uid());

-- ============================================================================
-- END OF EXAMPLE QUERIES
-- ============================================================================
