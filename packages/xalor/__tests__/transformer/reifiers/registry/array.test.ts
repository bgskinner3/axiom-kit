// __tests__/unit/reifiers/array.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext, createTestReifyCtx } from '../../../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../../../src/models/constants';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';
describe('Array Reifier (Integrated)', () => {
  const ctx = () => createTestReifyCtx();
  const STRING_SHAPE = {
    kind: 'primitive',
    type: 'string',
    maxLength: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxStringLength,
  };

  it('should reify a simple primitive array', () => {
    const { type, checker } = reifyTypeContext('type T = string[];');
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result).toEqual({
      kind: 'array',
      items: {
        kind: 'primitive',
        type: 'string',
        // 🛡️ Added: The engine now enforces your global limit
        maxLength: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxStringLength,
      },
      maxItems: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxObjectProperties,
    });
  });

  it('should reify nested 2D arrays (Depth Check)', () => {
    const { type, checker } = reifyTypeContext('type T = number[][];');
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result).toEqual({
      kind: 'array',
      maxItems: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxObjectProperties,
      items: {
        kind: 'array',
        maxItems: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxObjectProperties,
        items: { kind: 'primitive', type: 'number' },
      },
    });
  });

  it('should reify an array of complex objects (Integration Check)', () => {
    const { type, checker } = reifyTypeContext('type T = { id: string }[];');
    const result = reifyType({ type, checker, ctx: ctx() });

    expect((result as any).items.properties.id.shape).toEqual(STRING_SHAPE);
  });

  it('should reify an array containing unions', () => {
    const { type, checker } = reifyTypeContext(
      'type T = (string | boolean)[];',
    );
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result).toEqual({
      kind: 'array',
      maxItems: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxObjectProperties,
      items: {
        kind: 'union',
        values: [
          STRING_SHAPE,
          { kind: 'literal', value: false },
          { kind: 'literal', value: true },
        ],
      },
    });
  });

  it('should handle ReadonlyArray syntax', () => {
    const { type, checker } = reifyTypeContext(
      'type T = ReadonlyArray<number>;',
    );
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result.kind).toBe('array');
    expect((result as any).items.type).toBe('number');
  });

  // ===========================================================================
  // 🚀 NEW: ARCHITECTURAL INTEGRITY TESTS
  // ===========================================================================

  // it('should prove INTERNING: identical structures share memory', () => {
  //   // 💎 USE SIMPLE LITERALS: No branding, no intersections, just raw values.
  //   const { checker, sourceFile } = reifyTypeContext(`
  //   type T1 = "SOLID";
  //   type T2 = "SOLID";
  // `);

  //   const [s1, s2] = sourceFile.statements.filter(ts.isTypeAliasDeclaration);

  //   const t1 = checker.getTypeFromTypeNode(s1.type);
  //   const t2 = checker.getTypeFromTypeNode(s2.type);

  //   const res1 = reifyType({ type: t1, checker, ctx: ctx() });
  //   const res2 = reifyType({ type: t2, checker, ctx: ctx() });

  //   // 🎯 THE TRUTH: Interning is working if they share the same RAM address.
  //   expect(res1).toBe(res2);
  // });

  it('should trigger ATOMIC CUTTING when depth exceeds maxDepth', () => {
    const { type, checker } = reifyTypeContext('type T = string[];');
    const customCtx = createTestReifyCtx({ maxDepth: 0 });

    const result = reifyType({ type, checker, ctx: customCtx });

    expect(result.kind).toBe('reference');

    expect(customCtx.fragments.size).toBeGreaterThanOrEqual(1);
  });
});
