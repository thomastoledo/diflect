# Diflect

A lightweight utility to compare two JavaScript objects and identify differences. **diffent** computes additions, removals, and updates, supporting nested structures, ignored keys, and custom comparison logic.

## Features

- 📂 **Handles nested objects**: Recursively computes differences.  
- 🔑 **Ignore specific keys**: Exclude keys from comparison.  
- ⚙️ **Custom comparison**: Define your own logic for equality checks.  
- 🔄 **Lightweight & dependency-free**: Only pure TypeScript/JavaScript.

---

## Installation

Install using `npm` or `yarn`:

```bash
npm install @your-namespace/diffent
```

Or:

```bash
yarn add @your-namespace/diffent
```

---

## Usage

### Import the function

```typescript
import { objectDiff } from '@your-namespace/diffent';
```

### Basic Example

```typescript
const base = { a: 1, b: 2 };
const target = { a: 1, b: 3, c: 4 };

const diff = objectDiff(base, target);

console.log(diff);
/*
{
  added: { c: 4 },
  removed: {},
  updated: { b: 3 }
}
*/
```

---

### Examples

#### 1. **Nested Objects**

```typescript
const base = { user: { name: 'Alice', age: 25 }, active: true };
const target = { user: { name: 'Alice', age: 26 }, admin: true };

const diff = objectDiff(base, target);

console.log(diff);
/*
{
  added: { admin: true },
  removed: { active: true },
  updated: { user: { updated: { age: 26 } } }
}
*/
```

#### 2. **Ignoring Keys**

```typescript
const base = { a: 1, b: 2, metadata: { version: 1 } };
const target = { a: 1, b: 3, metadata: { version: 2 } };

const diff = objectDiff(base, target, { ignoreKeys: ['metadata'] });

console.log(diff);
/*
{
  added: {},
  removed: {},
  updated: { b: 3 }
}
*/
```

#### 3. **Custom Comparison Function**

```typescript
const base = { score: 99.5 };
const target = { score: 99.8 };

// Allow a tolerance of 0.5 for numeric comparisons
const compareFn = (a, b) => 
  typeof a === 'number' && typeof b === 'number'
    ? Math.abs(a - b) <= 0.5
    : a === b;

const diff = objectDiff(base, target, { compareFn });

console.log(diff);
/*
{
  added: {},
  removed: {},
  updated: {}
}
*/
```

---

## API

### `objectDiff<T>(base: T, target: T, options?: ObjectDiffOptions): ObjectDiff<T>`

#### Parameters

- **`base`**: The base object to compare from.  
- **`target`**: The target object to compare to.  
- **`options`** (optional):  
  - **`ignoreKeys`**: An array of keys to exclude from the comparison.  
  - **`compareFn`**: A custom function for comparing values. Defaults to strict equality (`===`).  

#### Returns

An object with the following properties:  
- **`added`**: Keys present in `target` but not in `base`.  
- **`removed`**: Keys present in `base` but not in `target`.  
- **`updated`**: Keys with different values between `base` and `target`.  

---

## License

MIT

## Contributing

Feel free to submit issues or pull requests to enhance this library! 😊