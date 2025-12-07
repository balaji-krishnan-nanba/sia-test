/**
 * Common types used throughout the application
 */

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}
