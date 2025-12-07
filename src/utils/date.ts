/**
 * Date formatting utilities
 */

import { format, formatDistanceToNow, parseISO, isToday as isTodayFns, isYesterday as isYesterdayFns } from 'date-fns';

/**
 * Parse a date string or Date object to Date
 */
function parseDate(date: string | Date): Date {
  return typeof date === 'string' ? parseISO(date) : date;
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @param formatStr - Format string (default: 'PPP' = Jan 15, 2024)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatStr = 'PPP'): string {
  const dateObj = parseDate(date);
  return format(dateObj, formatStr);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = parseDate(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Get relative time with smart formatting
 * For recent times: "Just now", "5 minutes ago"
 * For today: "Today at 3:45 PM"
 * For yesterday: "Yesterday at 3:45 PM"
 * For this week: "Monday at 3:45 PM"
 * Older: "Jan 15, 2024"
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = parseDate(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  // Just now (less than 1 minute)
  if (diffMins < 1) {
    return 'Just now';
  }

  // Less than an hour
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  }

  // Less than 24 hours
  if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  // Use date-fns for older dates
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format time duration in seconds to readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration (e.g., "1h 23m" or "45m 30s")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  return `${secs}s`;
}

/**
 * Format timer display (MM:SS or HH:MM:SS)
 * @param seconds - Time in seconds
 * @returns Formatted timer string
 */
export function formatTimer(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if the date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = parseDate(date);
  return isTodayFns(dateObj);
}

/**
 * Check if a date was yesterday
 * @param date - Date to check
 * @returns True if the date was yesterday
 */
export function wasYesterday(date: string | Date): boolean {
  const dateObj = parseDate(date);
  return isYesterdayFns(dateObj);
}

/**
 * Check if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are on the same day
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Get days between two dates
 * @param date1 - Start date
 * @param date2 - End date
 * @returns Number of days between the dates
 */
export function getDaysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get date range array (useful for calendars)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of date strings (YYYY-MM-DD)
 */
export function getDateRange(startDate: string | Date, endDate: string | Date): string[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const dates: string[] = [];

  const current = new Date(start);
  while (current <= end) {
    dates.push(format(current, 'yyyy-MM-dd'));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
