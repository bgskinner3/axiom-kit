type TTypeGuard<T> = (value: unknown) => value is T;
function assertValue<T>(
  value: unknown,
  typeGuard: TTypeGuard<T>,
  message?: string,
): asserts value is T {
  if (!typeGuard(value)) {
    throw new Error(message ?? 'Validation failed for value');
  }
}

export function forceType<T>(
  value: unknown,
  isValid: boolean,
): asserts value is T {
  if (!isValid) {
    throw new Error(
      `🔥 Type Assertion Failed: The calculated type does not match the expected type.`,
    );
  }
  // Prefixing with _ tells TS the unused variable is intentional
  const guard = (_v: unknown): _v is T => true;
  assertValue(value, guard);
}

export function expectType<T>(_value: T): void {}
