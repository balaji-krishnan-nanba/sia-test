/**
 * Progress Tracker - Track and persist user progress with Supabase
 */

import { supabase } from '@/lib/supabase';
import type { QuestionAttempt } from './scorer';
import type { SIAQualification } from '@/types/question';
import type { UserProgress, QualificationProgress } from '@/types/progress';

/**
 * Streak data
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  streakStartDate: string | null;
}

/**
 * Local cache for user progress to reduce database calls
 */
const progressCache = new Map<string, { data: UserProgress; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Save a question attempt to the database
 * @param userId - The user ID
 * @param attempt - The question attempt data
 * @returns Promise that resolves when saved
 */
export async function saveQuestionAttempt(
  userId: string,
  attempt: QuestionAttempt
): Promise<void> {
  try {
    const { error } = await supabase.from('question_attempts').insert({
      user_id: userId,
      question_id: attempt.questionId,
      unit_id: attempt.unitId,
      chapter_id: attempt.chapterId,
      difficulty: attempt.difficulty,
      user_answer: attempt.userAnswer,
      correct_answer: attempt.correctAnswer,
      is_correct: attempt.isCorrect,
      time_spent: attempt.timeSpent,
      attempted_at: attempt.attemptedAt,
    });

    if (error) {
      console.error('Error saving question attempt:', error);
      throw new Error('Failed to save question attempt');
    }

    // Invalidate cache
    progressCache.delete(userId);

    // Update daily activity
    await updateDailyActivity(userId, attempt);
  } catch (error) {
    console.error('Error in saveQuestionAttempt:', error);
    throw error;
  }
}

/**
 * Update daily activity stats
 * @param userId - The user ID
 * @param attempt - The question attempt data
 */
async function updateDailyActivity(userId: string, attempt: QuestionAttempt): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // Check if today's activity exists
    const { data: existing, error: fetchError } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw fetchError;
    }

    const studyTimeMinutes = Math.ceil(attempt.timeSpent / 60);

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('daily_activities')
        .update({
          questions_answered: existing.questions_answered + 1,
          correct_answers: existing.correct_answers + (attempt.isCorrect ? 1 : 0),
          study_time: existing.study_time + studyTimeMinutes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase.from('daily_activities').insert({
        user_id: userId,
        date: today,
        questions_answered: 1,
        correct_answers: attempt.isCorrect ? 1 : 0,
        study_time: studyTimeMinutes,
        mock_exams_taken: 0,
      });

      if (insertError) {
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error updating daily activity:', error);
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Get user progress for a specific exam
 * @param userId - The user ID
 * @param examSlug - The exam/qualification slug
 * @returns Promise resolving to user progress data
 */
export async function getUserProgress(
  userId: string,
  examSlug: string
): Promise<UserProgress | null> {
  // Check cache first
  const cached = progressCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No progress record yet
        return null;
      }
      throw error;
    }

    // Cache the result
    progressCache.set(userId, {
      data: data as UserProgress,
      timestamp: Date.now(),
    });

    return data as UserProgress;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw new Error('Failed to fetch user progress');
  }
}

/**
 * Get attempt history for a specific question
 * @param userId - The user ID
 * @param questionId - The question ID
 * @returns Promise resolving to array of attempts
 */
export async function getAttemptHistory(
  userId: string,
  questionId: string
): Promise<QuestionAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('question_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .order('attempted_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Convert from database format to QuestionAttempt format
    return (
      data?.map(
        (row): QuestionAttempt => ({
          questionId: row.question_id,
          unitId: row.unit_id,
          chapterId: row.chapter_id,
          difficulty: row.difficulty,
          userAnswer: row.user_answer,
          correctAnswer: row.correct_answer,
          isCorrect: row.is_correct,
          timeSpent: row.time_spent,
          attemptedAt: row.attempted_at,
        })
      ) || []
    );
  } catch (error) {
    console.error('Error fetching attempt history:', error);
    throw new Error('Failed to fetch attempt history');
  }
}

/**
 * Get all attempts for a user
 * @param userId - The user ID
 * @param qualification - Optional qualification filter
 * @param limit - Maximum number of attempts to return
 * @returns Promise resolving to array of attempts
 */
export async function getAllAttempts(
  userId: string,
  qualification?: SIAQualification,
  limit?: number
): Promise<QuestionAttempt[]> {
  try {
    let query = supabase
      .from('question_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Convert from database format to QuestionAttempt format
    let attempts: QuestionAttempt[] =
      data?.map(
        (row): QuestionAttempt => ({
          questionId: row.question_id,
          unitId: row.unit_id,
          chapterId: row.chapter_id,
          difficulty: row.difficulty,
          userAnswer: row.user_answer,
          correctAnswer: row.correct_answer,
          isCorrect: row.is_correct,
          timeSpent: row.time_spent,
          attemptedAt: row.attempted_at,
        })
      ) || [];

    // Filter by qualification if specified
    if (qualification) {
      const qualCode = qualification.toLowerCase();
      attempts = attempts.filter((a) => a.questionId.toLowerCase().startsWith(qualCode));
    }

    return attempts;
  } catch (error) {
    console.error('Error fetching all attempts:', error);
    throw new Error('Failed to fetch attempts');
  }
}

/**
 * Calculate study streak for a user
 * @param userId - The user ID
 * @returns Promise resolving to streak data
 */
export async function calculateStreak(userId: string): Promise<StreakData> {
  try {
    const { data, error } = await supabase
      .from('daily_activities')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        streakStartDate: null,
      };
    }

    const dates = data.map((d) => d.date).sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakStartDate: string | null = null;

    // Check if user studied today or yesterday to maintain streak
    if (dates[0] === today || dates[0] === yesterday) {
      currentStreak = 1;
      streakStartDate = dates[0];

      // Count consecutive days
      for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i - 1]);
        const previousDate = new Date(dates[i]);
        const diffDays = Math.floor(
          (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          currentStreak++;
          streakStartDate = dates[i];
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i - 1]);
      const previousDate = new Date(dates[i]);
      const diffDays = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      currentStreak,
      longestStreak,
      lastStudyDate: dates[0],
      streakStartDate,
    };
  } catch (error) {
    console.error('Error calculating streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      streakStartDate: null,
    };
  }
}

/**
 * Get daily activities for a date range
 * @param userId - The user ID
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Promise resolving to daily activities
 */
export async function getDailyActivities(
  userId: string,
  startDate: string,
  endDate: string
): Promise<
  Array<{
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
    studyTime: number;
    mockExamsTaken: number;
  }>
> {
  try {
    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return (
      data?.map((row) => ({
        date: row.date,
        questionsAnswered: row.questions_answered,
        correctAnswers: row.correct_answers,
        studyTime: row.study_time,
        mockExamsTaken: row.mock_exams_taken,
      })) || []
    );
  } catch (error) {
    console.error('Error fetching daily activities:', error);
    throw new Error('Failed to fetch daily activities');
  }
}

/**
 * Clear progress cache for a user
 * @param userId - The user ID
 */
export function clearProgressCache(userId?: string): void {
  if (userId) {
    progressCache.delete(userId);
  } else {
    progressCache.clear();
  }
}

/**
 * Save mock exam result
 * @param userId - The user ID
 * @param examData - Mock exam result data
 */
export async function saveMockExamResult(
  userId: string,
  examData: {
    qualification: SIAQualification;
    score: number;
    passingScore: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    questions: Array<{
      questionId: string;
      userAnswer: string | null;
      isCorrect: boolean;
    }>;
  }
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('mock_exam_attempts')
      .insert({
        user_id: userId,
        qualification: examData.qualification,
        score: examData.score,
        passing_score: examData.passingScore,
        passed: examData.score >= examData.passingScore,
        total_questions: examData.totalQuestions,
        correct_answers: examData.correctAnswers,
        time_spent: examData.timeSpent,
        questions: examData.questions,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Update daily activity
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existing) {
      await supabase
        .from('daily_activities')
        .update({
          mock_exams_taken: existing.mock_exams_taken + 1,
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('daily_activities').insert({
        user_id: userId,
        date: today,
        questions_answered: 0,
        correct_answers: 0,
        study_time: 0,
        mock_exams_taken: 1,
      });
    }

    // Invalidate cache
    progressCache.delete(userId);

    return data.id;
  } catch (error) {
    console.error('Error saving mock exam result:', error);
    throw new Error('Failed to save mock exam result');
  }
}
