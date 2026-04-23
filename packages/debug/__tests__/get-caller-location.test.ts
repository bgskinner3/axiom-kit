import { getCallerLocation } from '../src';

describe('getCallerLocation', () => {
  const mockStack = `Error: 
    at exampleFunction (/Users/dev/axiom-kit/packages/core/src/index.ts:10:5)
    at Object.<anonymous> (/Users/dev/axiom-kit/packages/core/__tests__/debug.test.ts:25:12)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at node_modules/jest-runner/build/index.js:50:12`.trim();

  beforeEach(() => {
    jest.spyOn(Error, 'captureStackTrace').mockImplementation((obj) => {
      (obj as { stack: string }).stack = mockStack;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('extracts the preferred index correctly', () => {
    const result = getCallerLocation({
      preferredIndex: 1,
      stripPathPrefix: '/Users/dev/axiom-kit/',
    });
    expect(result).toBe('packages/core/__tests__/debug.test.ts:25:12');
  });

  it('falls back to the fallbackIndex if preferred is out of range', () => {
    const result = getCallerLocation({
      preferredIndex: 99,
      fallbackIndex: 0,
      stripPathPrefix: '/Users/dev/axiom-kit/',
    });
    expect(result).toBe('packages/core/src/index.ts:10:5');
  });

  it('finds the top parent ignoring node_modules', () => {
    const result = getCallerLocation({
      topParent: true,
      stripPathPrefix: '/Users/dev/axiom-kit/',
    });
    expect(result).toContain('node:internal/modules/cjs/loader');
  });

  it('returns "unknown" if stack is missing', () => {
    // FIX: Must cast 'obj' here too to avoid the TS error again
    jest.spyOn(Error, 'captureStackTrace').mockImplementation((obj) => {
      (obj as { stack: string }).stack = '';
    });

    // We pass an empty object to ensure it uses our mocked stack
    expect(getCallerLocation({})).toBe('unknown');
  });

  it('strips the path prefix correctly', () => {
    const result = getCallerLocation({
      preferredIndex: 0,
      stripPathPrefix: '/Users/dev/axiom-kit/packages/core/',
    });
    expect(result).toBe('src/index.ts:10:5');
  });
});
