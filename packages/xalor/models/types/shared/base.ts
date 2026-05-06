export type TTypeGuard<T> = (value: unknown) => value is T;
export type TPrimitive = string | number | boolean | bigint;
export type TAnyFunction = (...args: unknown[]) => unknown;
export type TAssert<T> = (value: unknown) => asserts value is T;
