export type TTypeGuard<T> = (value: unknown) => value is T;

export type TAssert<T> = (value: unknown) => asserts value is T;

export type TAnyFunction = (...args: unknown[]) => unknown;

export type TAnyObject = Record<PropertyKey, unknown>;
