/**
 * Lazily calculates exponential backoff intervals with jitter.
 */
function* yieldBackoff(retries: number, delayMs: number): Generator<number> {
  for (let attempt = 0; attempt < retries; attempt++) {
    // Math: (base * 2^attempt) + random jitter
    yield delayMs * Math.pow(2, attempt) + Math.random() * 100;
  }
}
function isErrorWithProps(
  err: unknown,
): err is { code?: string; message?: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    err !== undefined &&
    ('code' in err || 'message' in err)
  );
}
/**
 * @utilType util
 * @name retry
 * @category Processors Network
 * @description Executes an async function with lazy exponential backoff and jitter upon encountering retryable errors.
 * @link #retry
 *
 * ---
 *
 * ## 🔄 retry — Resilience with Backoff
 *
 * This utility wraps an asynchronous operation and provides:
 * 1. **Lazy Backoff**: Uses a Generator to calculate wait times only when a failure occurs.
 * 2. **Jitter**: Adds a random offset to prevent "Thundering Herd" issues on your API.
 * 3. **Smart Filtering**: Only retries on specific errors (e.g., `Too Many Requests` or `BAD_DATA`).
 * 4. **Normalization**: Ensures any thrown value is converted to a standard JS `Error`.
 *
 * ---
 *
 * ### Example
 *
 * ```ts
 * // Retries up to 3 times, starting with a 500ms delay
 * const result = await retry(() => fetchJson('/api/data'), 3, 500);
 * ```
 *
 * ---
 *
 * @param fn - The async function to execute.
 * @param retries - Maximum number of retry attempts (default: 5).
 * @param delayMs - Initial delay in milliseconds for exponential backoff (default: 500).
 * @returns A promise resolving to the result of `fn`.
 * @throws The last encountered error if all retries are exhausted or a non-retryable error occurs.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delayMs = 500,
): Promise<T> {
  let lastError: unknown;
  const backoffSchedule = yieldBackoff(retries, delayMs);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // 🚀 The Goal: If it works, we exit immediately
      return await fn();
    } catch (err: unknown) {
      lastError = err;

      // 1. Determine if we should even bother retrying
      const isRetryable =
        isErrorWithProps(err) &&
        (err.code === 'BAD_DATA' || err.message?.includes('Too Many Requests'));

      // 2. Final attempt or non-retryable error? Throw immediately.
      if (!isRetryable || attempt === retries) {
        // throw err instanceof Error ? err : new Error(String(err));
        if (err instanceof Error) throw err;

        // 🚀 THE FIX: Deep extraction of message
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : String(err);

        throw new Error(errorMessage, { cause: err });
      }

      // 3. Get the next delay from our generator
      const nextDelay = backoffSchedule.next();

      if (!nextDelay.done) {
        const waitTime = nextDelay.value;
        console.warn(
          `[Retry] Attempt ${attempt + 1} failed. Retrying in ${Math.round(waitTime)}ms...`,
        );

        // 4. Wait for the calculated backoff period
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}
