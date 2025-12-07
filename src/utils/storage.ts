/**
 * Storage utilities - Type-safe localStorage wrapper
 */

/**
 * Storage error class
 */
class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Set an item in localStorage
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @throws StorageError if localStorage is not available or serialization fails
 */
export function setItem<T>(key: string, value: T): void {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    throw new StorageError('localStorage is not available');
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
    throw new StorageError(`Failed to set item with key: ${key}`);
  }
}

/**
 * Get an item from localStorage
 * @param key - Storage key
 * @returns The stored value or null if not found
 */
export function getItem<T>(key: string): T | null {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return null;
  }
}

/**
 * Get an item from localStorage with a default value
 * @param key - Storage key
 * @param defaultValue - Default value if item doesn't exist
 * @returns The stored value or default value
 */
export function getItemWithDefault<T>(key: string, defaultValue: T): T {
  const item = getItem<T>(key);
  return item !== null ? item : defaultValue;
}

/**
 * Remove an item from localStorage
 * @param key - Storage key
 */
export function removeItem(key: string): void {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
}

/**
 * Clear all items from localStorage
 * WARNING: This will remove ALL items, including those not created by this app
 */
export function clearAll(): void {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Clear all items with a specific prefix
 * @param prefix - Key prefix to match
 */
export function clearByPrefix(prefix: string): void {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing items by prefix:', error);
  }
}

/**
 * Check if a key exists in localStorage
 * @param key - Storage key
 * @returns True if the key exists
 */
export function hasItem(key: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Get all keys in localStorage
 * @param prefix - Optional prefix to filter keys
 * @returns Array of keys
 */
export function getAllKeys(prefix?: string): string[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const keys = Object.keys(localStorage);
    if (prefix) {
      return keys.filter((key) => key.startsWith(prefix));
    }
    return keys;
  } catch (error) {
    console.error('Error getting keys from localStorage:', error);
    return [];
  }
}

/**
 * Get storage size in bytes
 * @returns Approximate size in bytes
 */
export function getStorageSize(): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  } catch {
    return 0;
  }
}

/**
 * Get storage size in a human-readable format
 * @returns Size string (e.g., "1.2 KB")
 */
export function getStorageSizeFormatted(): string {
  const bytes = getStorageSize();

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Set an item with expiration
 * @param key - Storage key
 * @param value - Value to store
 * @param expirationMs - Expiration time in milliseconds
 */
export function setItemWithExpiry<T>(key: string, value: T, expirationMs: number): void {
  const item = {
    value,
    expiry: Date.now() + expirationMs,
  };
  setItem(key, item);
}

/**
 * Get an item with expiration check
 * @param key - Storage key
 * @returns The stored value or null if expired/not found
 */
export function getItemWithExpiry<T>(key: string): T | null {
  const item = getItem<{ value: T; expiry: number }>(key);

  if (!item) {
    return null;
  }

  // Check if expired
  if (Date.now() > item.expiry) {
    removeItem(key);
    return null;
  }

  return item.value;
}

/**
 * Safely execute a storage operation with error handling
 * @param operation - Storage operation to execute
 * @param fallback - Fallback value if operation fails
 * @returns Result of operation or fallback
 */
export function safeStorage<T>(operation: () => T, fallback: T): T {
  try {
    return operation();
  } catch (error) {
    console.error('Storage operation failed:', error);
    return fallback;
  }
}

/**
 * Storage event listener type
 */
type StorageListener = (key: string, newValue: any, oldValue: any) => void;

/**
 * Storage change listeners
 */
const listeners: Map<string, Set<StorageListener>> = new Map();

/**
 * Add a listener for storage changes
 * @param key - Storage key to watch
 * @param callback - Callback function
 * @returns Cleanup function to remove the listener
 */
export function addStorageListener(key: string, callback: StorageListener): () => void {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }

  listeners.get(key)!.add(callback);

  // Return cleanup function
  return () => {
    listeners.get(key)?.delete(callback);
  };
}

/**
 * Notify listeners of storage changes
 * This should be called after setItem operations
 */
function notifyListeners(key: string, newValue: any, oldValue: any): void {
  const keyListeners = listeners.get(key);
  if (keyListeners) {
    keyListeners.forEach((callback) => {
      try {
        callback(key, newValue, oldValue);
      } catch (error) {
        console.error('Error in storage listener:', error);
      }
    });
  }
}

/**
 * Enhanced setItem with change notification
 */
export function setItemWithNotification<T>(key: string, value: T): void {
  const oldValue = getItem<T>(key);
  setItem(key, value);
  notifyListeners(key, value, oldValue);
}

// Export the storage error class
export { StorageError };
