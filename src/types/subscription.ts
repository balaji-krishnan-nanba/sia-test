/**
 * Subscription and payment related types
 */

import type { SubscriptionTier } from './user';

// Re-export SubscriptionTier for convenience
export type { SubscriptionTier } from './user';

/**
 * Subscription plan
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number; // in pence/cents
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  isPopular?: boolean;
}

/**
 * User subscription
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription status
 */
export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'past_due'
  | 'unpaid'
  | 'trialing'
  | 'incomplete';

/**
 * Payment intent
 */
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret: string;
}

/**
 * Payment status
 */
export type PaymentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'cancelled';

/**
 * Payment method
 */
export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

/**
 * Invoice
 */
export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  invoiceUrl?: string;
  pdfUrl?: string;
  createdAt: string;
  paidAt?: string;
}

/**
 * Feature flags based on subscription tier
 */
export interface FeatureFlags {
  canAccessAllQualifications: boolean;
  canTakeMockExams: boolean;
  mockExamsPerMonth: number;
  canAccessPerformanceAnalytics: boolean;
  canDownloadCertificates: boolean;
  canAccessStudyPlanner: boolean;
  hasAdFreeExperience: boolean;
  hasPrioritySupport: boolean;
}
