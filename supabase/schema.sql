-- ============================================================================
-- SIA Exam Prep Platform - Complete Database Schema
-- ============================================================================
-- Version: 1.0.0
-- Created: 2025-12-07
-- Description: Comprehensive schema for user profiles, progress tracking,
--              bookmarks, mock exams, streaks, and sessions
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search (optional, for future features)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

-- Exam type enum for data validation
CREATE TYPE exam_type AS ENUM ('ds', 'sg', 'cctv', 'cp');

-- Session type enum
CREATE TYPE session_type AS ENUM ('practice', 'review', 'bookmarks', 'mock_exam');

-- Answer choice enum
CREATE TYPE answer_choice AS ENUM ('A', 'B', 'C', 'D');

-- ============================================================================
-- TABLE: user_profiles
-- ============================================================================
-- Purpose: Extends auth.users with application-specific profile data
-- Relationship: 1:1 with auth.users
-- ============================================================================

CREATE TABLE user_profiles (
    -- Primary Key (same as auth.users.id)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Profile Information
    display_name TEXT,
    avatar_url TEXT,

    -- Exam Configuration
    active_exams exam_type[] DEFAULT '{}',
    exam_dates JSONB DEFAULT '{}',
    -- Structure: {"ds": "2024-03-15", "sg": "2024-04-20"}

    -- User Preferences
    preferences JSONB DEFAULT '{
        "theme": "light",
        "notifications_enabled": true,
        "sound_enabled": true,
        "show_explanations": true,
        "daily_goal": 20
    }',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT valid_active_exams CHECK (
        active_exams IS NULL OR
        cardinality(active_exams) <= 4
    )
);

-- Indexes
CREATE INDEX idx_user_profiles_active_exams ON user_profiles USING GIN (active_exams);

-- Comments
COMMENT ON TABLE user_profiles IS 'Extended user profile data for SIA exam prep users';
COMMENT ON COLUMN user_profiles.active_exams IS 'Array of exam slugs user is preparing for';
COMMENT ON COLUMN user_profiles.exam_dates IS 'JSONB object mapping exam slug to scheduled exam date';
COMMENT ON COLUMN user_profiles.preferences IS 'User preferences for app behavior and UI';

-- ============================================================================
-- TABLE: user_progress
-- ============================================================================
-- Purpose: Track every question attempt (supports retakes)
-- Size: Will grow to millions of rows - heavily indexed
-- ============================================================================

CREATE TABLE user_progress (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Question Identification
    exam_slug exam_type NOT NULL,
    question_id TEXT NOT NULL,
    -- Format: "{exam}-unit{X}-chapter{X.Y}-q{N}"
    -- Example: "ds-unit2-chapter2.1-q1"

    -- Attempt Data
    is_correct BOOLEAN NOT NULL,
    selected_answer answer_choice,
    time_spent INTEGER, -- seconds

    -- Metadata
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT valid_time_spent CHECK (
        time_spent IS NULL OR time_spent >= 0
    )
);

-- Indexes (Critical for Performance)
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_user_exam ON user_progress(user_id, exam_slug);
CREATE INDEX idx_user_progress_user_question_time ON user_progress(user_id, question_id, attempted_at DESC);
CREATE INDEX idx_user_progress_attempted_at ON user_progress(attempted_at DESC);
CREATE INDEX idx_user_progress_exam_slug ON user_progress(exam_slug);

-- Composite index for "latest attempt" queries
CREATE INDEX idx_user_progress_latest_attempt ON user_progress(
    user_id,
    question_id,
    attempted_at DESC
) INCLUDE (is_correct, selected_answer, time_spent);

-- Partial index for recent activity (performance optimization)
CREATE INDEX idx_user_progress_recent ON user_progress(user_id, attempted_at DESC)
WHERE attempted_at > NOW() - INTERVAL '90 days';

-- Comments
COMMENT ON TABLE user_progress IS 'Tracks every question attempt with support for retakes';
COMMENT ON COLUMN user_progress.question_id IS 'Composite identifier: {exam}-unit{X}-chapter{X.Y}-q{N}';
COMMENT ON COLUMN user_progress.time_spent IS 'Time spent on question in seconds';

-- ============================================================================
-- TABLE: bookmarks
-- ============================================================================
-- Purpose: Store user-bookmarked questions for later review
-- ============================================================================

CREATE TABLE bookmarks (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Question Identification
    exam_slug exam_type NOT NULL,
    question_id TEXT NOT NULL,

    -- User Notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT unique_user_bookmark UNIQUE (user_id, question_id)
);

-- Indexes
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_user_exam ON bookmarks(user_id, exam_slug);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Comments
COMMENT ON TABLE bookmarks IS 'User-bookmarked questions for review';
COMMENT ON COLUMN bookmarks.notes IS 'User personal notes about the question';

-- ============================================================================
-- TABLE: mock_exam_attempts
-- ============================================================================
-- Purpose: Store complete mock exam sessions with detailed results
-- ============================================================================

CREATE TABLE mock_exam_attempts (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Exam Information
    exam_slug exam_type NOT NULL,

    -- Results
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 40,
    percentage DECIMAL(5,2) NOT NULL,
    pass_threshold DECIMAL(5,2) DEFAULT 80.0,
    passed BOOLEAN NOT NULL,

    -- Timing
    time_taken INTEGER, -- total seconds

    -- Detailed Breakdown
    questions_breakdown JSONB NOT NULL,
    -- Structure: [
    --   {
    --     "question_id": "ds-unit2-chapter2.1-q1",
    --     "selected_answer": "A",
    --     "is_correct": true,
    --     "time_spent": 45
    --   },
    --   ...
    -- ]

    -- Metadata
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Constraints
    CONSTRAINT valid_score CHECK (
        score >= 0 AND score <= total_questions
    ),
    CONSTRAINT valid_percentage CHECK (
        percentage >= 0 AND percentage <= 100
    ),
    CONSTRAINT valid_total_questions CHECK (
        total_questions > 0
    ),
    CONSTRAINT valid_time_logic CHECK (
        completed_at >= started_at
    ),
    CONSTRAINT valid_time_taken CHECK (
        time_taken IS NULL OR time_taken >= 0
    )
);

-- Indexes
CREATE INDEX idx_mock_attempts_user_id ON mock_exam_attempts(user_id);
CREATE INDEX idx_mock_attempts_user_exam_completed ON mock_exam_attempts(
    user_id,
    exam_slug,
    completed_at DESC
);
CREATE INDEX idx_mock_attempts_passed ON mock_exam_attempts(user_id, passed);
CREATE INDEX idx_mock_attempts_completed_at ON mock_exam_attempts(completed_at DESC);

-- GIN index for JSONB queries
CREATE INDEX idx_mock_attempts_breakdown ON mock_exam_attempts
USING GIN (questions_breakdown);

-- Comments
COMMENT ON TABLE mock_exam_attempts IS 'Complete mock exam attempts with detailed results';
COMMENT ON COLUMN mock_exam_attempts.questions_breakdown IS 'JSONB array with detailed per-question results';
COMMENT ON COLUMN mock_exam_attempts.percentage IS 'Calculated percentage score (0-100)';
COMMENT ON COLUMN mock_exam_attempts.pass_threshold IS 'Pass threshold percentage (typically 80 for SIA)';

-- ============================================================================
-- TABLE: user_streaks
-- ============================================================================
-- Purpose: Track daily practice streaks and activity
-- Relationship: 1:1 with users (one streak record per user)
-- ============================================================================

CREATE TABLE user_streaks (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys (unique per user)
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Streak Data
    current_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    last_activity_date DATE NOT NULL,
    total_days_active INTEGER DEFAULT 0 NOT NULL,

    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT valid_current_streak CHECK (current_streak >= 0),
    CONSTRAINT valid_longest_streak CHECK (longest_streak >= current_streak),
    CONSTRAINT valid_total_days CHECK (total_days_active >= 0)
);

-- Indexes
CREATE UNIQUE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_streaks_last_activity ON user_streaks(last_activity_date);

-- Comments
COMMENT ON TABLE user_streaks IS 'Daily practice streak tracking per user';
COMMENT ON COLUMN user_streaks.current_streak IS 'Current consecutive days of practice';
COMMENT ON COLUMN user_streaks.longest_streak IS 'All-time best streak';
COMMENT ON COLUMN user_streaks.last_activity_date IS 'Last date user practiced (DATE only)';

-- ============================================================================
-- TABLE: user_sessions
-- ============================================================================
-- Purpose: Group practice sessions for analytics and user insights
-- Optional but recommended for detailed analytics
-- ============================================================================

CREATE TABLE user_sessions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Session Information
    exam_slug exam_type NOT NULL,
    session_type session_type DEFAULT 'practice',

    -- Session Statistics
    questions_attempted INTEGER DEFAULT 0 NOT NULL,
    questions_correct INTEGER DEFAULT 0 NOT NULL,

    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- calculated seconds

    -- Constraints
    CONSTRAINT valid_questions_correct CHECK (
        questions_correct <= questions_attempted
    ),
    CONSTRAINT valid_session_time CHECK (
        ended_at IS NULL OR ended_at >= started_at
    ),
    CONSTRAINT valid_duration CHECK (
        duration IS NULL OR duration >= 0
    )
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_user_started ON user_sessions(user_id, started_at DESC);
CREATE INDEX idx_user_sessions_user_exam ON user_sessions(user_id, exam_slug);
CREATE INDEX idx_user_sessions_type ON user_sessions(session_type);

-- Comments
COMMENT ON TABLE user_sessions IS 'Practice session grouping for analytics';
COMMENT ON COLUMN user_sessions.duration IS 'Calculated session duration in seconds';

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: update_updated_at()
-- Purpose: Automatically update updated_at timestamp
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at() IS 'Trigger function to auto-update updated_at timestamp';

-- ----------------------------------------------------------------------------
-- Function: calculate_accuracy(user_id, exam_slug)
-- Purpose: Calculate accuracy percentage for a user and exam
-- Returns: DECIMAL percentage (0-100)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION calculate_accuracy(
    p_user_id UUID,
    p_exam_slug exam_type DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    v_accuracy DECIMAL;
BEGIN
    SELECT
        ROUND(
            (COUNT(*) FILTER (WHERE is_correct = true)::DECIMAL /
             COUNT(*)::DECIMAL * 100),
            2
        )
    INTO v_accuracy
    FROM (
        -- Get latest attempt for each question
        SELECT DISTINCT ON (question_id)
            is_correct
        FROM user_progress
        WHERE user_id = p_user_id
            AND (p_exam_slug IS NULL OR exam_slug = p_exam_slug)
        ORDER BY question_id, attempted_at DESC
    ) latest_attempts;

    RETURN COALESCE(v_accuracy, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_accuracy(UUID, exam_type) IS 'Calculate accuracy percentage based on latest attempts';

-- ----------------------------------------------------------------------------
-- Function: update_streak(user_id)
-- Purpose: Update user streak based on activity
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_last_activity DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
    v_total_days INTEGER;
    v_today DATE := CURRENT_DATE;
BEGIN
    -- Get current streak data or initialize
    SELECT
        last_activity_date,
        current_streak,
        longest_streak,
        total_days_active
    INTO
        v_last_activity,
        v_current_streak,
        v_longest_streak,
        v_total_days
    FROM user_streaks
    WHERE user_id = p_user_id;

    -- If no streak record exists, create one
    IF NOT FOUND THEN
        INSERT INTO user_streaks (
            user_id,
            current_streak,
            longest_streak,
            last_activity_date,
            total_days_active
        )
        VALUES (
            p_user_id,
            1,
            1,
            v_today,
            1
        );
        RETURN;
    END IF;

    -- If already practiced today, do nothing
    IF v_last_activity = v_today THEN
        RETURN;
    END IF;

    -- If practiced yesterday, increment streak
    IF v_last_activity = v_today - INTERVAL '1 day' THEN
        v_current_streak := v_current_streak + 1;
        v_total_days := v_total_days + 1;

        -- Update longest streak if current is higher
        IF v_current_streak > v_longest_streak THEN
            v_longest_streak := v_current_streak;
        END IF;

    -- If missed a day, reset streak
    ELSE
        v_current_streak := 1;
        v_total_days := v_total_days + 1;
    END IF;

    -- Update streak record
    UPDATE user_streaks
    SET
        current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        last_activity_date = v_today,
        total_days_active = v_total_days,
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_streak(UUID) IS 'Update user streak based on current activity';

-- ----------------------------------------------------------------------------
-- Function: get_progress_stats(user_id, exam_slug)
-- Purpose: Get comprehensive progress statistics
-- Returns: JSONB with various stats
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_progress_stats(
    p_user_id UUID,
    p_exam_slug exam_type
)
RETURNS JSONB AS $$
DECLARE
    v_stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_questions_attempted', COUNT(DISTINCT question_id),
        'total_attempts', COUNT(*),
        'correct_on_first_try', COUNT(*) FILTER (
            WHERE is_correct = true
            AND attempted_at = (
                SELECT MIN(attempted_at)
                FROM user_progress up2
                WHERE up2.user_id = up1.user_id
                AND up2.question_id = up1.question_id
            )
        ),
        'overall_accuracy', ROUND(
            (COUNT(*) FILTER (WHERE is_correct = true)::DECIMAL /
             COUNT(*)::DECIMAL * 100),
            2
        ),
        'average_time_per_question', ROUND(AVG(time_spent), 0),
        'total_time_spent', SUM(time_spent),
        'last_activity', MAX(attempted_at)
    )
    INTO v_stats
    FROM user_progress up1
    WHERE user_id = p_user_id
        AND exam_slug = p_exam_slug;

    RETURN v_stats;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_progress_stats(UUID, exam_type) IS 'Get comprehensive progress statistics for user and exam';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at on user_profiles
CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-update updated_at on user_streaks
CREATE TRIGGER trigger_user_streaks_updated_at
    BEFORE UPDATE ON user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-update streak on new progress entry
CREATE OR REPLACE FUNCTION trigger_update_streak_on_progress()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_streak(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_progress_update_streak
    AFTER INSERT ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_streak_on_progress();

COMMENT ON FUNCTION trigger_update_streak_on_progress() IS 'Automatically update streak when user completes a question';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- RLS Policies: user_profiles
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON user_profiles FOR DELETE
    USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- RLS Policies: user_progress
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- RLS Policies: bookmarks
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own bookmarks"
    ON bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
    ON bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
    ON bookmarks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
    ON bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: mock_exam_attempts
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own mock exam attempts"
    ON mock_exam_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mock exam attempts"
    ON mock_exam_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mock exam attempts"
    ON mock_exam_attempts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mock exam attempts"
    ON mock_exam_attempts FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: user_streaks
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own streaks"
    ON user_streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
    ON user_streaks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
    ON user_streaks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own streaks"
    ON user_streaks FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: user_sessions
-- ----------------------------------------------------------------------------

CREATE POLICY "Users can view own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON user_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON user_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
    ON user_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER VIEWS (Optional - for easier querying)
-- ============================================================================

-- View: latest_question_attempts
-- Purpose: Get latest attempt for each question per user
CREATE OR REPLACE VIEW latest_question_attempts AS
SELECT DISTINCT ON (user_id, question_id)
    id,
    user_id,
    exam_slug,
    question_id,
    is_correct,
    selected_answer,
    time_spent,
    attempted_at
FROM user_progress
ORDER BY user_id, question_id, attempted_at DESC;

COMMENT ON VIEW latest_question_attempts IS 'Latest attempt for each question per user';

-- View: user_accuracy_by_exam
-- Purpose: Calculate accuracy per user per exam
CREATE OR REPLACE VIEW user_accuracy_by_exam AS
SELECT
    user_id,
    exam_slug,
    COUNT(DISTINCT question_id) as questions_attempted,
    COUNT(*) FILTER (WHERE is_correct = true) as correct_answers,
    COUNT(*) as total_attempts,
    ROUND(
        (COUNT(*) FILTER (WHERE is_correct = true)::DECIMAL /
         COUNT(DISTINCT question_id)::DECIMAL * 100),
        2
    ) as accuracy_percentage
FROM latest_question_attempts
GROUP BY user_id, exam_slug;

COMMENT ON VIEW user_accuracy_by_exam IS 'User accuracy statistics per exam based on latest attempts';

-- ============================================================================
-- INDEXES FOR VIEWS (if materialized in future)
-- ============================================================================

-- Note: These views are regular views for now. If performance becomes an issue,
-- convert to materialized views and add refresh logic.

-- ============================================================================
-- INITIAL DATA / SEED DATA (Optional)
-- ============================================================================

-- No seed data required for this schema
-- User data will be created on signup

-- ============================================================================
-- GRANTS (if using service role)
-- ============================================================================

-- Grant necessary permissions to authenticated users
-- These are handled by RLS policies above

-- ============================================================================
-- SCHEMA VERSION TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_version (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    description TEXT
);

INSERT INTO schema_version (version, description)
VALUES ('1.0.0', 'Initial schema with user profiles, progress, bookmarks, mock exams, streaks, and sessions');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
