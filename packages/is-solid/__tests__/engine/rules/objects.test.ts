// __tests__/engine/rules/objects.test.ts
import { validateObject } from '../../../src/validation/objects';
import { createInitialContext } from '../../../src/validation/context';

/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST FOUR THINGS
 * I.   Total Compliance (All required keys present and valid)
 * II.  Optionality (Missing optional keys should not trigger errors)
 * III. Missing Requirements (Required keys must trigger 'missing' error)
 * IV.  Path Integrity (Breadcrumbs must use $.key format and reset correctly)
 */

describe('Engine Validator Rules Object', () => {
  it('should pass for a valid object matching all properties', () => {
    const ctx = createInitialContext();
    const data = { id: 1, name: 'Solid' };
    const shape = {
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
        name: {
          name: 'name',
          optional: false,
          shape: { kind: 'primitive', type: 'string' },
        },
      },
    };

    expect(validateObject(data, shape as any, ctx)).toBe(true);
    expect(ctx.errors).toHaveLength(0);
  });

  it('should pass when optional properties are missing', () => {
    const ctx = createInitialContext();
    const data = { id: 1 };
    const shape = {
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
        name: {
          name: 'name',
          optional: true,
          shape: { kind: 'primitive', type: 'string' },
        },
      },
    };

    expect(validateObject(data, shape as any, ctx)).toBe(true);
  });

  it('should fail and report "missing" for required properties', () => {
    const ctx = createInitialContext();
    const data = { name: 'Solid' }; // 'id' is missing
    const shape = {
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    };

    const result = validateObject(data, shape as any, ctx);

    expect(result).toBe(false);
    expect(ctx.errors[0].path).toBe('$.id');
    expect(ctx.errors[0].received).toBe('"missing"');
  });

  it('should maintain the $.root prefix and restore path after property loops', () => {
    const ctx = createInitialContext();
    ctx.path = '$';

    const data = { a: 1, b: 'fail' };
    const shape = {
      properties: {
        a: {
          name: 'a',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
        b: {
          name: 'b',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    };

    validateObject(data, shape as any, ctx);

    expect(ctx.errors[0].path).toBe('$.b');
    expect(ctx.path).toBe('$');
  });
});
// ==================================================
// ==================================================
// EDGE CASES
// ==================================================
// ==================================================
describe('Engine Validator Rules Object: EDGE CASES', () => {
  /**
   * NULL TRAP
   * !!! IN TS typeof null is "object"...This is the most common cause of runtime crashes.
   * !!! TEST THAT OUR isNull(data) check must prevents this.
   */
  it('should fail gracefully when receiving null instead of an object', () => {
    const ctx = createInitialContext();
    const data = null;
    const shape = {
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    };

    expect(validateObject(data, shape as any, ctx)).toBe(false);
    expect(ctx.errors[0].message).toContain('Validation failed');
    expect(ctx.errors[0].received).toBe('null');
  });
  /**
   * DEEP NESTING RESTORATION
   * !!! VERIFY that the path doesn't "get lost" when going three or four levels deep
   * !!! That the path  pops back up correctly for sibling properties.
   */
  it('should correctly pop the path back up after deep nesting (Path Popping)', () => {
    const ctx = createInitialContext();
    const data = {
      user: {
        profile: { id: 1 },
      },
      status: 'online',
    };

    const shape = {
      properties: {
        user: {
          name: 'user',
          optional: false,
          shape: {
            kind: 'object',
            properties: {
              profile: {
                name: 'profile',
                optional: false,
                shape: {
                  kind: 'object',
                  properties: {
                    id: {
                      name: 'id',
                      optional: false,
                      shape: { kind: 'primitive', type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
        status: {
          name: 'status',
          optional: false,
          shape: { kind: 'primitive', type: 'string' },
        },
      },
    };

    // Run validation
    validateObject(data, shape as any, ctx);

    expect(ctx.path).toBe('$');
  });
  /**
   * PRIMITIVE SABOTAGE
   * !!! What happens when a user passes a string where a object is suppose to be???
   * !!! we test here he isRecord or isObject guard at the top of your function
   */
  it('should fail if a primitive is passed instead of an object', () => {
    const ctx = createInitialContext();
    const data = 'I am not an object';
    const shape = {
      properties: {
        a: {
          name: 'a',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    };

    expect(validateObject(data, shape as any, ctx)).toBe(false);
    expect(ctx.errors[0].expected).toBe('"object"');
  });
});
