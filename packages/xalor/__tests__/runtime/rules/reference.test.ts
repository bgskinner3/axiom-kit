// __tests__/engine/rules/reference.test.ts
import { validateReference } from '../../../src/validation/reference';
import { createInitialContext } from '../../../src/validation/context';
import { Registry } from '../../../src/vault';
import { IS_SOLID_CONFIG_ITEMS } from '../../../src/models/constants';
/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST THREE THINGS
 * I.   Vault Lookup (Finding the shape by name)
 * II.  Recursive Handoff (Calling validate with the found shape)
 * III. Missing Link Safety (Handling keys not in the Registry)
 */
describe('Engine Validator Rules Reference', () => {
  it('should pass if the referenced shape from the Vault validates successfully', () => {
    const ctx = createInitialContext();
    const data = 'solid-user';

    // 1. Manually prime the Vault (Pillar 2)
    const mockShape = { kind: 'primitive' as const, type: 'string' as const };
    Registry.register({
      key: 'USER_ID',
      shape: mockShape,
      area: 'test.ts',
      version: '1.0.0',
    });

    const refShape = { kind: 'reference' as const, name: 'USER_ID' };

    expect(validateReference(data, refShape, ctx)).toBe(true);
  });

  it('should fail if the referenced shape exists but data is invalid', () => {
    const ctx = createInitialContext();
    const data = 123; // Should be string
    const refShape = { kind: 'reference' as const, name: 'USER_ID' };

    expect(validateReference(data, refShape, ctx)).toBe(false);
    expect(ctx.errors[0].path).toBe('$');
  });

  it('should fail and report an error if the reference name is missing from the Vault', () => {
    const ctx = createInitialContext();
    const refShape = { kind: 'reference' as const, name: 'GHOST_TYPE' };

    const result = validateReference('any data', refShape, ctx);

    expect(result).toBe(false);
    expect(ctx.errors[0].received).toBe('"Missing from Vault"');
  });
});
// ==================================================
// ==================================================
// EDGE CASES
// ==================================================
// ==================================================
describe('Engine Validator Rules Reference: EDGE CASES', () => {
  /**
   * INFINITE MIRROR
   * !!! VERIFY that validateReference doesn't just loop forever
   * !!! but relies on the Orchestrator's seen map to stop the craw
   */
  it('should handle circular references without stack overflow', () => {
    const ctx = createInitialContext();

    // Data: { self: { self: { ... } } }
    const data: any = {};
    data.self = data;

    // Registry: NODE points to itself
    Registry.register({
      key: 'NODE',
      shape: {
        kind: 'object',
        properties: {
          self: {
            name: 'self',
            optional: false,
            shape: { kind: 'reference', name: 'NODE' },
          },
        },
      },
      area: 'test.ts',
      version: '1.0.0',
    });

    const refShape = { kind: 'reference' as const, name: 'NODE' };

    expect(() => validateReference(data, refShape, ctx)).not.toThrow();
  });
  /**
   * CROSS POLLINATION-- CHECK
   * !!! What if a reference name exists in the Vault, but it was registered by a different version of a library?
   * !!! We Verify here that we resolve such an issue
   */
  it('should handle references that point to different metadata versions', () => {
    const ctx = createInitialContext();

    Registry.register({
      key: 'VERSIONED',
      version: IS_SOLID_CONFIG_ITEMS.solidVersion, // Different from your current internal version
      shape: { kind: 'primitive', type: 'string' },
      area: 'old-lib.ts',
    });

    const refShape = { kind: 'reference' as const, name: 'VERSIONED' };

    expect(validateReference('test', refShape, ctx)).toBe(true);
  });

  /**
   * DEEP REFERENCE PATHING
   * !!! VERIFY that when a reference fails inside a nested object,
   * !!! the Path is relative to the root, not the vault.
   */
  it('should report the correct data path when a referenced shape fails deeply', () => {
    const ctx = createInitialContext();
    ctx.path = '$.user';

    Registry.register({
      key: 'PROFILE',
      shape: {
        // 💎 FIX: Add the kind discriminator
        kind: 'object',
        properties: {
          age: {
            name: 'age',
            optional: false,
            shape: { kind: 'primitive', type: 'number' },
          },
        },
      },
      area: 'models.ts',
      version: '1.0.0',
    });

    const data = { age: 'not-a-number' };
    const refShape = { kind: 'reference' as const, name: 'PROFILE' };

    validateReference(data, refShape, ctx);

    expect(ctx.errors[0].path).toBe('$.user.age');
  });
});
