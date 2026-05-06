// __tests__/engine/rules/arrays.test.ts
import { validateArray } from '../../../src/validation/arrays';
import { createInitialContext } from '../../../src/validation/context';

/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST THREE THINGS
 * I. successful iteration
 * II. nested failure reporting
 * III.  path restoration
 */

describe('Engine Validator Rules Array', () => {
  it('should pass for a valid array of primitives', () => {
    const ctx = createInitialContext();
    const data = [1, 2, 3];
    const shape = {
      kind: 'array' as const,
      items: { kind: 'primitive' as const, type: 'number' as const },
    };

    expect(validateArray(data, shape, ctx)).toBe(true);
    expect(ctx.errors).toHaveLength(0);
  });

  it('should fail if the input is not an array', () => {
    const ctx = createInitialContext();
    const data = { not: 'an array' };
    const shape = {
      kind: 'array' as const,
      items: { kind: 'primitive' as const, type: 'unknown' as const },
    };

    expect(validateArray(data, shape, ctx)).toBe(false);
    expect(ctx.errors[0].expected).toBe('"array"');
  });

  it('should track the correct path for nested failures', () => {
    const ctx = createInitialContext();
    ctx.path = '$.items';

    const data = ['ok', 123, 'ok']; // Index 1 is invalid
    const shape = {
      kind: 'array' as const,
      items: { kind: 'primitive' as const, type: 'string' as const },
    };

    const result = validateArray(data, shape, ctx);

    expect(result).toBe(false);

    expect(ctx.errors[0].path).toBe('$.items.1');
  });

  it('should restore the original path after validation (Path Integrity)', () => {
    const ctx = createInitialContext();
    ctx.path = '$.root';

    const data = [1];
    const shape = {
      kind: 'array' as const,
      items: { kind: 'primitive' as const, type: 'number' as const },
    };

    validateArray(data, shape, ctx);

    expect(ctx.path).toBe('$.root');
  });
});

// ==================================================
// ==================================================
// EDGE CASES
// ==================================================
// ==================================================
describe('Engine Validator Rules Array: EDGE CASES', () => {
  /**
   * Empty Array (The "Vacuum" Check
   * !!!  Verify that the validator doesn't return false
   * !!! just because there's nothing to iterate over.
   */
  it('should pass for an empty array (Zero Iteration)', () => {
    const ctx = createInitialContext();
    const data: any[] = [];
    const shape = {
      kind: 'array' as const,
      items: { kind: 'primitive' as const, type: 'string' as const },
    };

    expect(validateArray(data, shape, ctx)).toBe(true);
    expect(ctx.errors).toHaveLength(0);
  });
  /**
   * Multi-Dimensional Pathing
   * !!! ensure that deeply nested array indices are captured in
   * !!! the breadcrumbs correctly (e.g., $.matrix.1.1).
   */
  it('should track deep paths in multi-dimensional arrays', () => {
    const ctx = createInitialContext();
    ctx.path = '$.matrix';

    const data = [
      [1, 2],
      ['error', 4],
    ];
    const shape = {
      kind: 'array' as const,
      items: {
        kind: 'array' as const,
        items: { kind: 'primitive' as const, type: 'number' as const },
      },
    };

    const result = validateArray(data, shape, ctx);

    expect(result).toBe(false);
    expect(ctx.errors[0].path).toBe('$.matrix.1.0');
  });

  /**
   * Heterogeneous Failure || Compound Failure Test
   * !!! Verify that if an array contains multiple invalid items, the validator correctly
   * !!! identifies the first one (since every short-circuits) or
   * !!! collects them if you change logic later.
   */
  it('should fail on the first invalid item in a mixed array', () => {
    const ctx = createInitialContext();
    const data = ['valid', 123, 456]; // Two numbers fail string check
    const shape = {
      kind: 'array' as const,
      items: { kind: 'primitive' as const, type: 'string' as const },
    };

    validateArray(data, shape, ctx);

    // 'every' stops at the first failure
    expect(ctx.errors).toHaveLength(1);
    expect(ctx.errors[0].path).toBe('$.1');
  });
});
