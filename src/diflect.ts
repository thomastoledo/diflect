import { optimizedDifference } from "taibeul";

/**
 * Represents the difference between two objects.
 */
export interface ObjectDiff<T> {
  added: Partial<T>;
  removed: Partial<T>;
  updated: Partial<T>;
}

/**
 * Options for the objectDiff function.
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
 * Computes the difference between two arrays using `taibeul` functions.
 *
 * @param base - The base array to compare from.
 * @param target - The target array to compare to.
 * @returns An object with added and removed elements.
 */
export function ArraysDiff<T>(base: T[], target: T[]): { added: T[]; removed: T[] } {
  return {
    added: optimizedDifference(target, base), // Elements in `target` but not in `base`
    removed: optimizedDifference(base, target), // Elements in `base` but not in `target`
  };
}

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

  // Process keys present in the target object
  for (const key of Object.keys(target)) {
    if (shouldIgnoreKey(key)) continue;

    const targetValue = target[key];
    const baseValue = base[key];

    if (!(key in base)) {
      // Key is added in the target object
      added[key as keyof T] = targetValue;
    } else if (Array.isArray(targetValue) && Array.isArray(baseValue)) {
      // Handle differences in arrays
      const arrayDiff = ArraysDiff(baseValue, targetValue);
      if (arrayDiff.added.length || arrayDiff.removed.length) {
        updated[key as keyof T] = arrayDiff as any;
      }
    } else if (isObject(targetValue) && isObject(baseValue)) {
      // Handle nested objects
      const nestedDiff = objectDiff(baseValue, targetValue, options);
      if (!isEmptyDiff(nestedDiff)) {
        updated[key as keyof T] = nestedDiff as any;
      }
    } else if (!compareFn(baseValue, targetValue)) {
      // Handle updated primitive values
      updated[key as keyof T] = targetValue;
    }
  }

  // Process keys present in the base object but not in the target object
  for (const key of Object.keys(base)) {
    if (shouldIgnoreKey(key)) continue;

    if (!(key in target)) {
      // Key is removed from the base object
      removed[key as keyof T] = base[key];
    }
  }

  return { added, removed, updated };
}

/**
 * Checks if a value is an object.
 * 
 * @param value - The value to check.
 * @returns `true` if the value is a plain object, otherwise `false`.
 */
function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a diff result is empty (no added, removed, or updated keys).
 * 
 * @param diff - The diff object to check.
 * @returns `true` if the diff is empty, otherwise `false`.
 */
function isEmptyDiff<T>(diff: ObjectDiff<T>): boolean {
  return (
    Object.keys(diff.added).length === 0 &&
    Object.keys(diff.removed).length === 0 &&
    Object.keys(diff.updated).length === 0
  );
}
