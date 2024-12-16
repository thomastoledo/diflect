// object-diff.ts

/**
 * Represents the difference between two objects.
 */
export interface ObjectDiff<T> {
  added: Partial<T>;
  removed: Partial<T>;
  updated: Partial<T>;
}

/**
 * Options for objectDiff function.
 */
export interface ObjectDiffOptions {
  ignoreKeys?: string[]; // Keys to ignore during comparison
  compareFn?: (a: any, b: any) => boolean; // Custom comparison function
}

/**
 * Default comparison function (shallow equality).
 */
const defaultCompareFn = (a: any, b: any): boolean => a === b;

/**
 * Recursively computes the difference between two objects.
 * 
 * @param base - The base object to compare from.
 * @param target - The target object to compare to.
 * @param options - Options for ignoring keys and custom comparison.
 * @returns An object representing the added, removed, and updated keys.
 */
export function objectDiff<T extends Record<string, any>>(
  base: T,
  target: T,
  options: ObjectDiffOptions = {}
): ObjectDiff<T> {
  const { ignoreKeys = [], compareFn = defaultCompareFn } = options;
  const added: Partial<T> = {};
  const removed: Partial<T> = {};
  const updated: Partial<T> = {};

  // Helper to check if a key should be ignored
  const shouldIgnoreKey = (key: string): boolean => ignoreKeys.includes(key);

  // Find added or updated keys
  for (const key of Object.keys(target)) {
    if (shouldIgnoreKey(key)) continue;

    if (!(key in base)) {
      added[key as keyof T] = target[key];
    } else if (isObject(target[key]) && isObject(base[key])) {
      // Recursively compute differences for nested objects
      const nestedDiff = objectDiff(base[key], target[key], options);
      if (!isEmptyDiff(nestedDiff)) {
        updated[key as keyof T] = nestedDiff as any;
      }
    } else if (!compareFn(base[key], target[key])) {
      updated[key as keyof T] = target[key];
    }
  }

  // Find removed keys
  for (const key of Object.keys(base)) {
    if (shouldIgnoreKey(key)) continue;

    if (!(key in target)) {
      removed[key as keyof T] = base[key];
    }
  }

  return { added, removed, updated };
}

/**
 * Checks if a value is an object.
 */
function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a diff result is empty (no added, removed, or updated keys).
 */
function isEmptyDiff<T>(diff: ObjectDiff<T>): boolean {
  return (
    Object.keys(diff.added).length === 0 &&
    Object.keys(diff.removed).length === 0 &&
    Object.keys(diff.updated).length === 0
  );
}
