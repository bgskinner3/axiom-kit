export type TTypeGuard<T> = (value: unknown) => value is T;
export type TPrimitive = string | number | boolean | bigint;
export type TAnyFunction = (...args: unknown[]) => unknown;
