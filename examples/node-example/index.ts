import { objectDiff, diffArrays } from 'diflect';

// Object comparison example
const baseObject = {
  name: 'Alice',
  age: 25,
  skills: ['JavaScript', 'TypeScript'],
  address: { city: 'Paris', country: 'France' },
};

const targetObject = {
  name: 'Alice',
  age: 26,
  skills: ['JavaScript', 'TypeScript', 'React'],
  address: { city: 'Paris', country: 'Italy' },
};

const objectDifference = objectDiff(baseObject, targetObject);
console.log('Object Difference:', JSON.stringify(objectDifference, null, 2));

// Array comparison example
const baseArray = [1, 2, 3, 4, 5];
const targetArray = [3, 4, 5, 6, 7];

const arrayDifference = diffArrays(baseArray, targetArray);
console.log('Array Difference:', arrayDifference);
