import type { TTypeGuard } from '../../src';
function assertValue<T>(
  value: unknown,
  typeGuard: TTypeGuard<T>,
  message?: string,
): asserts value is T {
  if (!typeGuard(value)) {
    throw new Error(message ?? 'Validation failed for value');
  }
}
/**
 * Forcefully narrows 'value' to type 'T' using your assertion utility.
 * Use this in tests to avoid 'as' or 'any'.
 */
export function forceType<T>(value: unknown): asserts value is T {
  // Prefixing with _ tells TS the unused variable is intentional
  const guard = (_v: unknown): _v is T => true;
  assertValue(value, guard);
}
