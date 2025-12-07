/**
 * User and Authentication related types
 */

import type { SIAQualification } from './question';

/**
 * User authentication provider
 */
export type AuthProvider = 'google' | 'email';

/**
 * User subscription tier
 */
export type SubscriptionTier = 'free' | 'basic' | 'premium';

/**
 * User role
 */
export type UserRole = 'student' | 'admin';

/**
 * Core User interface
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  authProvider: AuthProvider;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * User profile with additional information
 */
export interface UserProfile extends User {
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string;
  targetQualification?: SIAQualification;
  examDate?: string;
  preferences: UserPreferences;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  reminderTime?: string; // HH:MM format
  theme: 'light' | 'dark' | 'auto';
  soundEffects: boolean;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData extends LoginCredentials {
  displayName: string;
  targetQualification?: SIAQualification;
}
