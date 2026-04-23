import { retry } from '../src';

const flushPromises = () =>
  new Promise(jest.requireActual('timers').setImmediate);

describe('Async Utilities: retry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should return result immediately on first successful attempt', async () => {
    const task = jest.fn().mockResolvedValue('success');
    const result = await retry(task);

    expect(result).toBe('success');
    expect(task).toHaveBeenCalledTimes(1);
  });

  it('should retry on "Too Many Requests" error and eventually succeed', async () => {
    const task = jest
      .fn()
      .mockRejectedValueOnce(new Error('Too Many Requests'))
      .mockRejectedValueOnce(new Error('Too Many Requests'))
      .mockResolvedValue('third-time-lucky');

    const promise = retry(task, 3, 100);

    // 🚀 THE FIX: Await both to prevent unhandled rejection warnings
    await Promise.all([
      jest.runAllTimersAsync(),
      expect(promise).resolves.toBe('third-time-lucky'),
    ]);

    expect(task).toHaveBeenCalledTimes(3);
  });

  it('should throw immediately on a non-retryable error', async () => {
    const fatalError = new Error('Fatal System Error');
    const task = jest.fn().mockRejectedValue(fatalError);

    // No timers needed here as it throws instantly
    await expect(retry(task)).rejects.toThrow('Fatal System Error');
    expect(task).toHaveBeenCalledTimes(1);
  });

  it('should exhaust all retries and throw the last error', async () => {
    const task = jest.fn().mockRejectedValue(new Error('Too Many Requests'));
    const promise = retry(task, 2, 100);

    // 🚀 THE FIX: Link timer completion and rejection check
    await Promise.all([
      jest.runAllTimersAsync(),
      expect(promise).rejects.toThrow('Too Many Requests'),
    ]);

    expect(task).toHaveBeenCalledTimes(3);
  });

  it('should apply exponential backoff (timing check)', async () => {
    const task = jest.fn().mockRejectedValue(new Error('Too Many Requests'));
    const promise = retry(task, 2, 100);

    // 🚀 THE FIX: Attach a catch handler immediately to prevent global crash
    const catchHandler = expect(promise).rejects.toThrow();

    await flushPromises();
    jest.advanceTimersByTime(150);
    await flushPromises();
    await flushPromises();
    expect(task).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(350);
    await flushPromises();
    await flushPromises();
    expect(task).toHaveBeenCalledTimes(3);

    await jest.runAllTimersAsync();
    await catchHandler; // Now wait for the actual assertion
  });

  it('should normalize non-Error objects into standard Errors', async () => {
    const task = jest.fn().mockRejectedValue({
      message: 'Strange Object Error',
      code: 'BAD_DATA',
    });

    const promise = retry(task, 0, 0); // Test immediate normalization

    await expect(promise).rejects.toThrow('Strange Object Error');
  });
});
