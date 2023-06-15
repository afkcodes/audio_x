const isValidArray = (arr: any[]) => arr && Array.isArray(arr) && arr.length;
const isValidFunction = (value: any) =>
  value instanceof Function && typeof value === 'function';

const isValidObject = (value: any) =>
  typeof value === 'object' && value !== null;

const isValidWindow = typeof window !== undefined && window instanceof Window;

export { isValidArray, isValidFunction, isValidObject, isValidWindow };
