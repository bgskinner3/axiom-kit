// __tests__/unit/reifiers/intersections.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext, createTestReifyCtx } from '../../../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../../../src/models/constants';
import '../../../../transformer/reifiers/registry/index';

describe('Intersection Reifier (Integrated)', () => {
  // 🏛️ Setup fresh context for every test
  const ctx = () => createTestReifyCtx();

  const STRING_SHAPE = {
    kind: 'primitive',
    type: 'string',
    maxLength: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxStringLength,
  };

  it('should reify a basic object intersection', () => {
    const { type, checker } = reifyTypeContext(`
      type Combined = { a: string } & { b: number };
    `);

    // 🚀 NEW: Updated to Object Params
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result.kind).toBe('intersection');
    const intersection = result as any;
    expect(intersection.parts.length).toBe(2);
    expect(intersection.parts[0].properties.a.shape).toEqual(STRING_SHAPE);
    expect(intersection.parts[1].properties.b.shape.type).toBe('number');
  });

  it('should verify that Branded types are NOT treated as generic intersections', () => {
    // 💎 LAW: Branded reifier (priority 1) must intercept before Intersection (priority 2)
    const { type, checker } = reifyTypeContext(`
      type User = { id: number } & { __brand: "User" };
    `);
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result.kind).toBe('branded');
    expect(result.kind).not.toBe('intersection');
  });

  // it('should prove INTERNING: identical intersections share memory address', () => {
  //   const { checker, sourceFile } = reifyTypeContext(`
  //     type I1 = { a: number } & { b: string };
  //     type I2 = { a: number } & { b: string };
  //   `);

  //   const [s1, s2] = sourceFile.statements.filter(ts.isTypeAliasDeclaration);
  //   const t1 = checker.getTypeFromTypeNode(s1.type);
  //   const t2 = checker.getTypeFromTypeNode(s2.type);

  //   const res1 = reifyType({ type: t1, checker, ctx: ctx() });
  //   const res2 = reifyType({ type: t2, checker, ctx: ctx() });

  //   // 🧠 Proof that the "Fingerprint" logic caught the identical intersection structure
  //   expect(res1).toBe(res2);
  // });

  it('should reify intersections of mixed primitives and objects', () => {
    const { type, checker } = reifyTypeContext(`
      type Tagged = string & { _tag: 'metadata' };
    `);
    const result = reifyType({ type, checker, ctx: ctx() });
    const intersection = result as any;

    expect(intersection.kind).toBe('intersection');
    expect(intersection.parts[0]).toEqual(STRING_SHAPE);
    expect(intersection.parts[1].kind).toBe('object');
  });

  it('should reify intersections containing unions (Distributed Logic)', () => {
    const { type, checker } = reifyTypeContext(`
      type Complex = { id: number } & ("A" | "B");
    `);
    const result = reifyType({ type, checker, ctx: ctx() });

    // 💎 TS distributions check: result is a UNION of INTERSECTIONS
    expect(result.kind).toBe('union');
    const union = result as any;
    expect(union.values[0].kind).toBe('intersection');
    expect(union.values[0].parts[1].value).toBe('A');
  });

  it('should handle depth fragmentation within intersections', () => {
    // Force a fragment jump inside one of the parts
    const { type, checker } = reifyTypeContext(`
      type PartA = { deep: { deeper: { deepest: string } } };
      type PartB = { other: number };
      type T = PartA & PartB;
    `);

    const customCtx = createTestReifyCtx({ maxDepth: 2 });
    const result = reifyType({ type, checker, ctx: customCtx });

    const intersection = result as any;
    // PartA should contain a reference because it exceeds depth 2
    expect(
      intersection.parts[0].properties.deep.shape.properties.deeper.shape.kind,
    ).toBe('reference');
  });
});

// // __tests__/unit/reifiers/intersections.test.ts
// import { reifyType } from '../../../../transformer/reifiers/reify-type';
// import { reifyTypeContext } from '../../../utils';
// // NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
// import '../../../../transformer/reifiers/registry/index';

// describe('Intersection Reifier (Integrated)', () => {
//   it('should reify a basic object intersection', () => {
//     const { type, checker } = reifyTypeContext(`
//       type Combined = { a: string } & { b: number };
//     `);
//     const result = reifyType(type, checker);

//     expect(result.kind).toBe('intersection');
//     const intersection = result as any;

//     expect(intersection.parts.length).toBe(2);
//     expect(intersection.parts[0].kind).toBe('object');
//     expect(intersection.parts[1].kind).toBe('object');
//   });

//   it('should handle multi-part intersections (3+ parts)', () => {
//     const { type, checker } = reifyTypeContext(`
//       type Triple = { a: 1 } & { b: 2 } & { c: 3 };
//     `);
//     const result = reifyType(type, checker);
//     const intersection = result as any;

//     expect(intersection.parts.length).toBe(3);
//   });

//   it('should reify deep nested intersections', () => {
//     const { type, checker } = reifyTypeContext(`
//       type Deep = { outer: { a: string } & { b: number } };
//     `);
//     const result = reifyType(type, checker);

//     // Navigate to the 'outer' property
//     const outerShape = (result as any).properties.outer.shape;

//     expect(outerShape.kind).toBe('intersection');
//     expect(outerShape.parts.length).toBe(2);
//   });

//   it('should verify that Branded types are NOT treated as generic intersections', () => {
//     // This is the most important "Negative" test.
//     // It proves that the Branded reifier (which is higher in index.ts)
//     // intercepts the brand before the Intersection reifier sees it.
//     const { type, checker } = reifyTypeContext(`
//       type User = { id: number } & { __brand: "User" };
//     `);
//     const result = reifyType(type, checker);

//     expect(result.kind).toBe('branded');
//     expect(result.kind).not.toBe('intersection');
//   });
//   it('should reify intersections of mixed primitives and objects', () => {
//     // This happens in certain "Tagging" patterns
//     const { type, checker } = reifyTypeContext(`
//       type Tagged = string & { _tag: 'metadata' };
//     `);
//     const result = reifyType(type, checker);
//     const intersection = result as any;

//     expect(intersection.kind).toBe('intersection');
//     // Part 0 should be the primitive string
//     expect(intersection.parts[0].kind).toBe('primitive');
//     // Part 1 should be the object literal
//     expect(intersection.parts[1].kind).toBe('object');
//   });

//   it('should reify intersections containing unions (Distributed Logic)', () => {
//     const { type, checker } = reifyTypeContext(`
//     type Complex = { id: number } & ("A" | "B");
//   `);
//     const result = reifyType(type, checker);

//     // 💎 Reality Check: TS distributes intersections over unions
//     expect(result.kind).toBe('union');

//     const union = result as any;
//     expect(union.values[0].kind).toBe('intersection');
//     expect(union.values[0].parts[0].kind).toBe('object');
//     expect(union.values[0].parts[1].kind).toBe('literal');
//   });

//   /**
//    * ALIAS CASE
//    * !!! TESTING  if a user defines a base type and extends it via an alias, the Miner won't go blind
//    */
//   it('should reify intersections involving named type aliases (Alias Resolution)', () => {
//     const { type, checker } = reifyTypeContext(`
//       type Base = { id: number };
//       type Extended = Base & { name: string };
//     `);
//     const result = reifyType(type, checker);

//     // This proves the reifier used 'aliasSymbol' to find the underlying intersection
//     expect(result.kind).toBe('intersection');
//     const intersection = result as any;

//     expect(intersection.parts[0].kind).toBe('object');
//     expect(intersection.parts[1].kind).toBe('object');
//     expect(intersection.parts[0].properties.id).toBeDefined();
//   });
// });
