import { objectDiff, ObjectDiff, ArraysDiff } from './diflect';

describe('diflect', () => {
  describe('diffArrays', () => {
    test('identifies added and removed elements', () => {
      const base = [1, 2, 3];
      const target = [2, 3, 4];
      const diff = ArraysDiff(base, target);
      expect(diff).toEqual({
        added: [4],
        removed: [1],
      });
    });

    test('handles identical arrays', () => {
      const base = [1, 2, 3];
      const target = [1, 2, 3];
      const diff = ArraysDiff(base, target);
      expect(diff).toEqual({
        added: [],
        removed: [],
      });
    });

    test('handles empty arrays', () => {
      const base: number[] = [];
      const target: number[] = [];
      const diff = ArraysDiff(base, target);
      expect(diff).toEqual({
        added: [],
        removed: [],
      });
    });

    test('handles large arrays efficiently', () => {
      const base = Array.from({ length: 1000 }, (_, i) => i);
      const target = [...base, 1000];
      const diff = ArraysDiff(base, target);
      expect(diff).toEqual({
        added: [1000],
        removed: [],
      });
    });
  });

  describe('objectDiff', () => {
    test('identifies added, removed, and updated keys', () => {
      const base = { a: 1, b: 2, c: 3 };
      const target = { a: 1, b: 20, d: 4 };
      const diff = objectDiff(base, target);
      expect(diff).toEqual({
        added: { d: 4 },
        removed: { c: 3 },
        updated: { b: 20 },
      });
    });

    test('handles nested objects', () => {
      const base = { a: { x: 1, y: 2 }, b: 2 };
      const target = { a: { x: 1, y: 20 }, b: 2 };
      const diff = objectDiff(base, target);
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: { a: { added: {}, removed: {}, updated: { y: 20 } } },
      });
    });

    test('handles arrays in objects', () => {
      const base = { a: [1, 2], b: [3, 4] };
      const target = { a: [1, 2, 3], b: [3, 4] };
      const diff = objectDiff(base, target);
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: {
          a: { added: [3], removed: [] },
        },
      });
    });

    test('respects ignoreKeys option', () => {
      const base = { a: 1, b: 2, c: 3 };
      const target = { a: 10, b: 20, c: 3 };
      const diff = objectDiff(base, target, { ignoreKeys: ['a'] });
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: { b: 20 },
      });
    });

    test('handles custom comparison function', () => {
      const base = { a: '1', b: '2' };
      const target = { a: 1, b: '20' };
      const diff = objectDiff(base, target, {
        compareFn: (a, b) => String(a) === String(b),
      });
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: { b: '20' },
      });
    });

    test('handles empty objects', () => {
      const base = {};
      const target = {};
      const diff = objectDiff(base, target);
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: {},
      });
    });

    test('handles null values', () => {
      const base = { a: null, b: 2 };
      const target = { a: null, b: null };
      const diff = objectDiff(base, target);
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: { b: null },
      });
    });

    test('returns empty diff for identical objects', () => {
      const base = { a: 1, b: 2 };
      const target = { a: 1, b: 2 };
      const diff = objectDiff(base, target);
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: {},
      });
    });

    test('handles complex nested objects with ignoreKeys', () => {
      const base = { nested: { x: 1, y: 2, z: 3 } };
      const target = { nested: { x: 10, y: 2, z: 30 } };
      const diff = objectDiff(base, target, { ignoreKeys: ['z'] });
      expect(diff).toEqual({
        added: {},
        removed: {},
        updated: {
          nested: {
            added: {},
            removed: {},
            updated: { x: 10 },
          },
        },
      });
    });
  });
});
