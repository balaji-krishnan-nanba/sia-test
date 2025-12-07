/**
 * Seeded Random Number Generator
 * Uses Linear Congruential Generator (LCG) for deterministic randomness
 */

/**
 * Create a seeded random number generator
 * @param seed - Integer seed value
 * @returns Function that generates random numbers between 0 and 1
 */
export function createSeededRandom(seed: number): () => number {
  let state = Math.abs(Math.floor(seed)) || 1;

  return () => {
    // LCG formula: (a * state + c) % m
    // Using values from Numerical Recipes
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Seeded Fisher-Yates shuffle
 * @param array - Array to shuffle
 * @param seed - Seed for random number generator
 * @returns Shuffled array (creates a new array)
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = createSeededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  return shuffled;
}

/**
 * Generate a consistent seed from exam slug and test number
 * @param examSlug - The exam identifier
 * @param testNumber - Test number (1-10)
 * @returns Integer seed
 */
export function generateMockTestSeed(examSlug: string, testNumber: number): number {
  // Create a deterministic hash from exam slug and test number
  let hash = 0;
  const str = `${examSlug}-test-${testNumber}`;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
}
