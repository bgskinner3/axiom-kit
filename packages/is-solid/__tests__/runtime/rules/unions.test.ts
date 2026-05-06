// __tests__/engine/rules/unions.test.ts
import { validateUnion } from '../../../src/validation/unions';
import { createInitialContext } from '../../../src/validation/context';

/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST FOUR THINGS
 * I.   Success Propagation (Stop on first match)
 * II.  Error Suppression (Failed branches must not pollute successful results)
 * III. Exhaustive Reporting (All branch failures recorded on total fail)
 * IV.  Summary Anchoring (A final high-level error added on total fail)
 */
describe('Engine Validator Rules Unions', () => {
  it('should pass and remain silent if one branch matches', () => {
    const ctx = createInitialContext();
    const data = 'match';
    const shape = {
      kind: 'union' as const,
      values: [
        { kind: 'primitive', type: 'number' }, // Fail
        { kind: 'primitive', type: 'string' }, // Success
      ],
    };

    const result = validateUnion(data, shape as any, ctx);

    expect(result).toBe(true);

    expect(ctx.errors).toHaveLength(0);
  });

  it('should fail and report all details if every branch fails', () => {
    const ctx = createInitialContext();
    const data = true; // Boolean fails both number and string
    const shape = {
      kind: 'union' as const,
      values: [
        { kind: 'primitive', type: 'number' },
        { kind: 'primitive', type: 'string' },
      ],
    };

    const result = validateUnion(data, shape as any, ctx);

    expect(result).toBe(false);

    expect(ctx.errors.length).toBe(3);
    expect(ctx.errors[ctx.errors.length - 1].message).toContain(
      'Validation failed',
    );
  });

  it('should handle complex nested branch failures correctly', () => {
    const ctx = createInitialContext();
    ctx.path = '$.data';
    const data = { id: 'not-a-number' };

    const shape = {
      kind: 'union' as const,
      values: [
        { kind: 'primitive', type: 'string' }, // Branch 1: Fail (data is object)
        {
          kind: 'object',
          properties: {
            // Branch 2: Fail (id is string)
            id: {
              name: 'id',
              optional: false,
              shape: { kind: 'primitive', type: 'number' },
            },
          },
        },
      ],
    };

    validateUnion(data, shape as any, ctx);

    const hasDeepError = ctx.errors.some((e) => e.path === '$.data.id');
    expect(hasDeepError).toBe(true);
  });

  it('should handle boolean literals (true | false) as a standard union', () => {
    const ctx = createInitialContext();
    const data = false;
    const shape = {
      kind: 'union' as const,
      values: [
        { kind: 'literal', value: true },
        { kind: 'literal', value: false },
      ],
    };

    expect(validateUnion(data, shape as any, ctx)).toBe(true);
    expect(ctx.errors).toHaveLength(0);
  });
});
// ==================================================
// ==================================================
// EDGE CASES
// ==================================================
// ==================================================
describe('Engine Validator Rules Unions: EDGE CASES', () => {
  /**
   * NO BRANCHES MATCJH
   * !!! VERIFY that we get the summary error and the sub-errors.
   */
  it('should fail and provide a summary error when no branches match', () => {
    const ctx = createInitialContext();
    const data = 123;
    const shape = {
      kind: 'union' as const,
      values: [
        { kind: 'literal', value: 'A' },
        { kind: 'literal', value: 'B' },
      ],
    };

    const result = validateUnion(data, shape as any, ctx);

    expect(result).toBe(false);
    expect(ctx.errors.length).toBe(3);
    expect(ctx.errors[2].message).toContain('Validation failed');
  });
  /**
   * DEEP BRANCH FAILURE
   * !!! ENSURE that if a union branch is a complex object, the path is still correct.
   */
  it('should track deep paths even inside union branches', () => {
    const ctx = createInitialContext();
    const data = { type: 'user', id: 'not-a-number' };

    const shape = {
      kind: 'union' as const,
      values: [
        { kind: 'primitive', type: 'string' },
        {
          kind: 'object',
          properties: {
            id: {
              name: 'id',
              optional: false,
              shape: { kind: 'primitive', type: 'number' },
            },
          },
        },
      ],
    };

    validateUnion(data, shape as any, ctx);

    expect(ctx.errors.some((e) => e.path === '$.id')).toBe(true);
  });
});
