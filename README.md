# Diflect

**Diflect** is a lightweight utility library for comparing objects and arrays in JavaScript/TypeScript. It computes the differences between two objects or arrays, providing details on added, removed, and updated keys or values.

### Features

- **Object Differences**: Compare two objects to identify added, removed, and updated keys.
- **Array Differences**: Compare arrays efficiently using optimized algorithms.
- **Nested Structures**: Handles deep nested objects and arrays seamlessly.
- **Custom Comparison**: Supports custom comparison functions for flexible use cases.
- **Ignored Keys**: Specify keys to ignore during comparison.
- **Performance**: Leverages efficient algorithms for array and object comparison, suitable for large datasets.

---

## Installation

Install Diflect using npm or yarn:

```bash
npm install diflect
# or
yarn add diflect
```

---

## Usage

### Importing Diflect

```typescript
import { objectDiff } from 'diflect';
```

### Example: Object Difference

```typescript
const base = { a: 1, b: 2, c: 3 };
const target = { a: 1, b: 20, d: 4 };

const diff = objectDiff(base, target);

console.log(diff);
// Output:
// {
//   added: { d: 4 },
//   removed: { c: 3 },
//   updated: { b: 20 },
// }
```

### Example: Nested Objects

```typescript
const base = { nested: { x: 1, y: 2 } };
const target = { nested: { x: 10, y: 2 } };

const diff = objectDiff(base, target);

console.log(diff);
// Output:
// {
//   added: {},
//   removed: {},
//   updated: {
//     nested: {
//       added: {},
//       removed: {},
//       updated: { x: 10 },
//     },
//   },
// }
```

### Example: Arrays

```typescript
const base = { a: [1, 2, 3], b: [3, 4] };
const target = { a: [1, 2, 4], b: [3, 4, 5] };

const diff = objectDiff(base, target);

console.log(diff);
// Output:
// {
//   added: {},
//   removed: {},
//   updated: {
//     a: { added: [4], removed: [3] },
//     b: { added: [5], removed: [] },
//   },
// }
```

### Example: Ignore Keys

```typescript
const base = { a: 1, b: 2, c: 3 };
const target = { a: 10, b: 20, c: 3 };

const diff = objectDiff(base, target, { ignoreKeys: ['c'] });

console.log(diff);
// Output:
// {
//   added: {},
//   removed: {},
//   updated: { a: 10, b: 20 },
// }
```

### Example: Custom Comparison Function

```typescript
const base = { a: '1', b: '2' };
const target = { a: 1, b: 2 };

const diff = objectDiff(base, target, {
  compareFn: (a, b) => String(a) === String(b),
});

console.log(diff);
// Output:
// {
//   added: {},
//   removed: {},
//   updated: {},
// }
```

---

## API Documentation

### `objectDiff<T>(base: T, target: T, options?: ObjectDiffOptions): ObjectDiff<T>`

#### Parameters
- **`base`**: The base object to compare from.
- **`target`**: The target object to compare to.
- **`options`**:
  - `ignoreKeys` (string[]): Keys to ignore during comparison.
  - `compareFn` ((a: any, b: any) => boolean): Custom comparison function.

#### Returns
An object with the following structure:
```typescript
interface ObjectDiff<T> {
  added: Partial<T>; // Keys added in the target object
  removed: Partial<T>; // Keys removed from the base object
  updated: Partial<T>; // Keys updated in the target object
}
```

---

### `diffArrays<T>(base: T[], target: T[]): { added: T[]; removed: T[] }`

#### Parameters
- **`base`**: The base array to compare from.
- **`target`**: The target array to compare to.

#### Returns
An object with the following structure:
```typescript
{
  added: T[]; // Elements present in `target` but not in `base`
  removed: T[]; // Elements present in `base` but not in `target`
}
```

---

## Roadmap

- **Custom Deep Comparison**: Extend support for custom comparison in nested structures.
- **Performance Enhancements**: Optimize nested structure comparisons for very large objects.
- **Type Refinements**: Add stricter TypeScript typing for deeply nested comparisons.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push the branch: `git push origin my-feature-branch`
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details. 