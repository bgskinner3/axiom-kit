// __tests__/engine/rules/intersections.test.ts
import { validateIntersection } from '../../../src/validation/intersections';
import { createInitialContext } from '../../../src/validation/context';

/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST THREE THINGS
 * I.   total compliance (All parts pass)
 * II.  partial failure (One part fails)
 * III. error suppression (No duplicate reports for same path)
 */

describe('Engine Validator Rules Intersection', () => {
  it('should pass if data satisfies all parts of the intersection', () => {
    const ctx = createInitialContext();
    const data = { id: 1, name: 'Solid' };
    const shape = {
      kind: 'intersection' as const,
      parts: [
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
        {
          kind: 'object',
          properties: {
            name: {
              name: 'name',
              optional: false,
              shape: { kind: 'primitive', type: 'string' },
            },
          },
        },
      ],
    };

    expect(validateIntersection(data, shape as any, ctx)).toBe(true);
    expect(ctx.errors).toHaveLength(0);
  });

  it('should fail if even one part of the intersection is unsatisfied', () => {
    const ctx = createInitialContext();
    const data = { id: 1, name: 123 }; // name should be string
    const shape = {
      kind: 'intersection' as const,
      parts: [
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
        {
          kind: 'object',
          properties: {
            name: {
              name: 'name',
              optional: false,
              shape: { kind: 'primitive', type: 'string' },
            },
          },
        },
      ],
    };

    const result = validateIntersection(data, shape as any, ctx);

    expect(result).toBe(false);
    expect(ctx.errors).toHaveLength(1);
    expect(ctx.errors[0].path).toBe('$.name');
  });

  it('should stop at the first failure (Short-circuiting)', () => {
    const ctx = createInitialContext();
    const data = 'not-an-object';

    const shape = {
      kind: 'intersection' as const,
      parts: [
        { kind: 'object', properties: {} },
        { kind: 'object', properties: {} },
      ],
    };

    validateIntersection(data, shape as any, ctx);
    expect(ctx.errors).toHaveLength(1);
  });
});

// ==================================================
// ==================================================
// EDGE CASES
// ==================================================
// ==================================================
describe('Engine Validator Rules Intersection: EDGE CASES', () => {
  /**
   * MIXED INTERSECTION
   * !!! tests when an intersection contains different types
   * !!! (e.g., a string that must also satisfy an object structure).
   * !!! While this often results in never in TS, in runtime JSON it can happen with "tagged" primitives.
   */
  it('should fail if data matches one kind but fails another (Mixed Kinds)', () => {
    const ctx = createInitialContext();
    const data = 'just-a-string';

    const shape = {
      kind: 'intersection' as const,
      parts: [
        { kind: 'primitive', type: 'string' },
        {
          kind: 'object',
          properties: {
            length: {
              name: 'length',
              optional: false,
              shape: { kind: 'primitive', type: 'number' },
            },
          },
        },
      ],
    };

    expect(validateIntersection(data, shape as any, ctx)).toBe(false);
  });
  /**
   * PROPERTY OVERLAP CONFLICT
   * !!! If Part A says property x must be a string and Part B says
   * !!! property x must be a number, the intersection is impossible.
   * !!! TESTING HERE-- that we should catch the first contradiction.
   */
  it('should fail on conflicting property requirements', () => {
    const ctx = createInitialContext();
    const data = { x: 10 };

    const shape = {
      kind: 'intersection' as const,
      parts: [
        {
          kind: 'object',
          properties: {
            x: {
              name: 'x',
              optional: false,
              shape: { kind: 'primitive', type: 'string' },
            },
          },
        },
        {
          kind: 'object',
          properties: {
            x: {
              name: 'x',
              optional: false,
              shape: { kind: 'primitive', type: 'number' },
            },
          },
        },
      ],
    };

    expect(validateIntersection(data, shape as any, ctx)).toBe(false);

    expect(ctx.errors[0].expected).toBe('"string"');
  });
  /**
   * NESTED INTERSECTION RECURSION
   * !!! Verify that validateIntersection correctly passes the ctx through multiple
   * !!! levels of validate() calls without losing the path.
   */
  it('should maintain path depth through nested intersections', () => {
    const ctx = createInitialContext();
    ctx.path = '$';
    const data = { nested: { id: 'not-a-number' } };

    const shape = {
      kind: 'intersection' as const,
      parts: [
        {
          kind: 'object',
          properties: {
            nested: {
              name: 'nested',
              optional: false,
              shape: {
                kind: 'intersection',
                parts: [
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
              },
            },
          },
        },
      ],
    };

    validateIntersection(data, shape as any, ctx);
    expect(ctx.errors[0].path).toBe('$.nested.id');
  });
});
