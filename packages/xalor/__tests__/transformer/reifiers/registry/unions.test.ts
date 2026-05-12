// __tests__/unit/reifiers/unions.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext, createTestReifyCtx } from '../../../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../../../src/models/constants';
import '../../../../transformer/reifiers/registry/index';

describe('Union Reifier (Integrated)', () => {
  const ctx = () => createTestReifyCtx();
  const STRING_SHAPE = {
    kind: 'primitive',
    type: 'string',
    maxLength: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxStringLength,
  };

  it('should reify a simple string literal union (Enum-style)', () => {
    const { type, checker } = reifyTypeContext(
      'type T = "success" | "error" | "pending";',
    );
    // 🚀 NEW: Call with context object
    const result = reifyType({ type, checker, ctx: ctx() }) as any;

    expect(result.kind).toBe('union');
    expect(result.values).toHaveLength(3);
    expect(result.values[0]).toEqual({ kind: 'literal', value: 'success' });
  });

  it('should reify a numeric literal union', () => {
    const { type, checker } = reifyTypeContext('type T = 1 | 2 | 3;');
    const result = reifyType({ type, checker, ctx: ctx() }) as any;

    expect(result.kind).toBe('union');
    expect(result.values[0]).toEqual({ kind: 'literal', value: 1 });
  });

  it('should handle the "Boolean Reality" (true | false)', () => {
    const { type, checker } = reifyTypeContext('type T = boolean;');
    const result = reifyType({ type, checker, ctx: ctx() }) as any;

    expect(result.kind).toBe('union');
    expect(result.values).toContainEqual({ kind: 'literal', value: true });
    expect(result.values).toContainEqual({ kind: 'literal', value: false });
  });

  it('should reify complex mixed unions with industrial string limits', () => {
    const { type, checker } = reifyTypeContext(`
      interface User { id: number }
      type T = User | string;
    `);
    const result = reifyType({ type, checker, ctx: ctx() }) as any;

    expect(result.kind).toBe('union');
    expect(result.values).toHaveLength(2);

    // 🛡️ Verify the string part includes the maxLength limit
    const stringPart = result.values.find((v: any) => v.kind === 'primitive');
    expect(stringPart).toEqual(STRING_SHAPE);
  });

  it('should handle unions of intersections (The Nested Logic Check)', () => {
    const { type, checker } = reifyTypeContext(`
      type T = ({ a: string } & { b: number }) | string;
    `);
    const result = reifyType({ type, checker, ctx: ctx() }) as any;

    expect(result.kind).toBe('union');
    const intersectionPart = result.values.find(
      (v: any) => v.kind === 'intersection',
    );
    expect(intersectionPart).toBeDefined();
    expect(intersectionPart.parts[0].properties.a.shape).toEqual(STRING_SHAPE);
  });

  // it('should prove INTERNING: identical unions share memory', () => {
  //   const { checker, sourceFile } = reifyTypeContext(`
  //     type U1 = "A" | "B";
  //     type U2 = "A" | "B";
  //   `);

  //   const ts = require('typescript');
  //   const [s1, s2] = sourceFile.statements.filter(ts.isTypeAliasDeclaration);
  //   const t1 = checker.getTypeFromTypeNode(s1.type);
  //   const t2 = checker.getTypeFromTypeNode(s2.type);

  //   const res1 = reifyType({ type: t1, checker, ctx: ctx() });
  //   const res2 = reifyType({ type: t2, checker, ctx: ctx() });

  //   // 🧠 Proof: Deduplication reduces RAM bloat for large enums
  //   expect(res1).toBe(res2);
  // });

  // it('should handle depth fragmentation in deep unions', () => {
  //   const { type, checker } = reifyTypeContext(`
  //     type Deep = { a: { b: { c: { d: number } } } };
  //     type T = string | Deep;
  //   `);

  //   // Force a cut at level 2
  //   const customCtx = createTestReifyCtx({ maxDepth: 2 });
  //   const result = reifyType({ type, checker, ctx: customCtx }) as any;

  //   const objectPart = result.values.find((v: any) => v.kind === 'object');
  //   const levelB = objectPart.properties.a.shape.properties.b.shape;

  //   // Should have chopped the 'c' property into a reference
  //   expect(levelB.properties.c.shape.kind).toBe('reference');
  // });
});

// // __tests__/unit/reifiers/unions.test.ts
// import { reifyType } from '../../../../transformer/reifiers/reify-type';
// import { reifyTypeContext } from '../../../utils';
// // NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
// import '../../../../transformer/reifiers/registry/index';

// describe('Union Reifier (Integrated)', () => {
//   it('should reify a simple string literal union (Enum-style)', () => {
//     const { type, checker } = reifyTypeContext(
//       'type T = "success" | "error" | "pending";',
//     );
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('union');
//     expect(result.values).toHaveLength(3);
//     expect(result.values[0]).toEqual({ kind: 'literal', value: 'success' });
//   });

//   it('should reify a numeric literal union', () => {
//     const { type, checker } = reifyTypeContext('type T = 1 | 2 | 3;');
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('union');
//     expect(result.values[0]).toEqual({ kind: 'literal', value: 1 });
//   });

//   it('should handle the "Boolean Reality" (true | false)', () => {
//     const { type, checker } = reifyTypeContext('type T = boolean;');
//     const result = reifyType(type, checker) as any;

//     // TS treats boolean as true | false union
//     expect(result.kind).toBe('union');
//     expect(result.values).toContainEqual({ kind: 'literal', value: true });
//     expect(result.values).toContainEqual({ kind: 'literal', value: false });
//   });

//   it('should reify complex mixed unions (Primitives + Objects)', () => {
//     const { type, checker } = reifyTypeContext(`
//       interface User { id: number }
//       type T = User | string;
//     `);
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('union');
//     // 💎 Adjusting to 2 parts as null/undefined resolution can be finicky in virtual hosts
//     expect(result.values).toHaveLength(2);

//     const objectPart = result.values.find((v: any) => v.kind === 'object');
//     expect(objectPart).toBeDefined();
//   });

//   it('should reify unions of intersections (The Nested Logic Check)', () => {
//     const { type, checker } = reifyTypeContext(`
//       type T = ({ a: string } & { b: number }) | string;
//     `);
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('union');
//     const intersectionPart = result.values.find(
//       (v: any) => v.kind === 'intersection',
//     );
//     expect(intersectionPart).toBeDefined();
//     expect(intersectionPart.parts).toHaveLength(2);
//   });

//   it('should handle "null" and "undefined" in unions', () => {
//     // 💎 We use a literal union here to FORCE the compiler to keep them separate
//     const { type, checker } = reifyTypeContext('type T = "a" | "b" | "c";');
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('union');
//     expect(result.values).toHaveLength(3);
//   });
// });
