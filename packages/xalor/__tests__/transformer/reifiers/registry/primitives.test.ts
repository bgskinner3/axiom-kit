// __tests__/unit/reifiers/primitives.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext, createTestReifyCtx } from '../../../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../../../src/models/constants';
import '../../../../transformer/reifiers/registry/index';

describe('Primitive Reifier (Integrated)', () => {
  // 🏛️ Setup fresh context for every test
  const ctx = () => createTestReifyCtx();

  it('should reify base primitives with industrial limits', () => {
    const basicPrimitives = ['number', 'bigint'];

    basicPrimitives.forEach((t) => {
      const { type, checker } = reifyTypeContext(`type T = ${t};`);
      const result = reifyType({ type, checker, ctx: ctx() });
      expect(result).toEqual({ kind: 'primitive', type: t });
    });

    // 🛡️ SPECIAL CASE: String must include maxLength from Config
    const { type: sType, checker: sChecker } =
      reifyTypeContext(`type T = string;`);
    const sResult = reifyType({ type: sType, checker: sChecker, ctx: ctx() });

    expect(sResult).toEqual({
      kind: 'primitive',
      type: 'string',
      maxLength: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxStringLength,
    });
  });

  it('should reify boolean as the union it truly is', () => {
    const { type, checker } = reifyTypeContext(`type T = boolean;`);
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result).toEqual({
      kind: 'union',
      values: [
        { kind: 'literal', value: false },
        { kind: 'literal', value: true },
      ],
    });
  });

  it('should reify literals accurately', () => {
    const cases = [
      {
        code: 'type T = "admin";',
        expected: { kind: 'literal', value: 'admin' },
      },
      { code: 'type T = 42;', expected: { kind: 'literal', value: 42 } },
      { code: 'type T = true;', expected: { kind: 'literal', value: true } },
    ];

    cases.forEach(({ code, expected }) => {
      const { type, checker } = reifyTypeContext(code);
      const result = reifyType({ type, checker, ctx: ctx() });
      expect(result).toEqual(expected);
    });
  });

  it('should handle null, undefined, any, and unknown as unknown primitives', () => {
    const fallbacks = ['null', 'undefined', 'any', 'unknown'];

    fallbacks.forEach((f) => {
      const { type, checker } = reifyTypeContext(`type T = ${f};`);
      const result = reifyType({ type, checker, ctx: ctx() });

      expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
    });
  });

  it('should prove INTERNING: identical primitives share the same memory reference', () => {
    const { type: t1, checker } = reifyTypeContext('type T = string;');
    const { type: t2 } = reifyTypeContext('type T = string;');

    const res1 = reifyType({ type: t1, checker, ctx: ctx() });
    const res2 = reifyType({ type: t2, checker, ctx: ctx() });

    // 💎 Memory efficiency check
    expect(res1).toBe(res2);
  });
});

// // __tests__/unit/reifiers/primitives.test.ts
// import { reifyType } from '../../../../transformer/reifiers/reify-type';
// import { reifyTypeContext } from '../../../utils';
// // NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
// import '../../../../transformer/reifiers/registry/index';

// describe('Primitive Reifier (Integrated)', () => {
//   it('should reify all base primitives', () => {
//     // Split boolean out because it reifies as a Union
//     // TODO: NOTE boolean type is not a primitive; it is a shorthand for the union true | false!!
//     const basicPrimitives = ['string', 'number', 'bigint'];

//     basicPrimitives.forEach((t) => {
//       const { type, checker } = reifyTypeContext(`type T = ${t};`);
//       const result = reifyType(type, checker);
//       expect(result).toEqual({ kind: 'primitive', type: t });
//     });

//     // SPECIAL TESY CASE: Test boolean specifically as the union it truly is
//     const { type, checker } = reifyTypeContext(`type T = boolean;`);
//     const result = reifyType(type, checker);
//     expect(result).toEqual({
//       kind: 'union',
//       values: [
//         { kind: 'literal', value: false },
//         { kind: 'literal', value: true },
//       ],
//     });
//   });

//   it('should reify specific string literals', () => {
//     const { type, checker } = reifyTypeContext('type T = "admin";');
//     const result = reifyType(type, checker);
//     expect(result).toEqual({ kind: 'literal', value: 'admin' });
//   });

//   it('should reify specific numeric literals', () => {
//     const { type, checker } = reifyTypeContext('type T = 42;');
//     const result = reifyType(type, checker);
//     expect(result).toEqual({ kind: 'literal', value: 42 });
//   });

//   it('should reify boolean literals (true / false)', () => {
//     const { type, checker } = reifyTypeContext('type T = true;');
//     const result = reifyType(type, checker);
//     expect(result).toEqual({ kind: 'literal', value: true });
//   });

//   it('should handle null and undefined as unknown primitives', () => {
//     const units = ['null', 'undefined'];

//     units.forEach((u) => {
//       const { type, checker } = reifyTypeContext(`type T = ${u};`);
//       const result = reifyType(type, checker);
//       // Based on our previous fix, these map to unknown for the vault
//       expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
//     });
//   });

//   it('should fallback to unknown for "any" or "unknown"', () => {
//     const fallbacks = ['any', 'unknown'];

//     fallbacks.forEach((f) => {
//       const { type, checker } = reifyTypeContext(`type T = ${f};`);
//       const result = reifyType(type, checker);
//       expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
//     });
//   });
// });
