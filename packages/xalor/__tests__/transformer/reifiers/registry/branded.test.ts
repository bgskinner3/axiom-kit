// __tests__/unit/reifiers/branded.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext, createTestReifyCtx } from '../../../utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../../../src/models/constants';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Branded Reifier (Integrated)', () => {
  // 🏛️ Setup fresh context for every test
  const ctx = () => createTestReifyCtx();

  const STRING_SHAPE = {
    kind: 'primitive',
    type: 'string',
    maxLength: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxStringLength,
  };

  it('should identify a branded string literal intersection', () => {
    const { type, checker } = reifyTypeContext(
      'type UserId = string & { __brand: "UserId" };',
    );

    // 🚀 Update to Object Params
    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result).toEqual({
      kind: 'branded',
      name: 'UserId',
      base: STRING_SHAPE, // 🛡️ Now includes maxLength
    });
  });

  it('should identify a branded object (Flattened Interface)', () => {
    const { type, checker } = reifyTypeContext(`
      interface User { id: number }
      type SolidUser = User & { __brand: "SolidUser" };
    `);

    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result.kind).toBe('branded');
    const branded = result as any;
    expect(branded.name).toBe('SolidUser');
    expect(branded.base.kind).toBe('object');
    expect(branded.base.properties.id.shape).toEqual({
      kind: 'primitive',
      type: 'number',
    });
  });

  it('should identify a branded object (Pure Type Literal)', () => {
    const { type, checker } = reifyTypeContext(`
      type SolidProfile = { username: string } & { __brand: "Profile" };
    `);

    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result.kind).toBe('branded');
    const branded = result as any;
    expect(branded.name).toBe('Profile');
    expect(branded.base.properties.username.shape).toEqual(STRING_SHAPE);
  });

  it('should handle ambient global TSolid branding', () => {
    const { type, checker } = reifyTypeContext(`
      type AmbientUser = TSolid<"GlobalKey", { age: number }>;
    `);

    const result = reifyType({ type, checker, ctx: ctx() });

    expect(result.kind).toBe('branded');
    const branded = result as any;
    expect(branded.name).toBe('GlobalKey');
    expect(branded.base.properties.age.shape).toEqual({
      kind: 'primitive',
      type: 'number',
    });
  });

  // it('should prove INTERNING: Branded shapes with same base share memory', () => {
  //   const { checker, sourceFile } = reifyTypeContext(`
  //     type B1 = string & { __brand: "X" };
  //     type B2 = string & { __brand: "X" };
  //   `);

  //   const [s1, s2] = sourceFile.statements.filter(ts.isTypeAliasDeclaration);
  //   const t1 = checker.getTypeFromTypeNode(s1.type);
  //   const t2 = checker.getTypeFromTypeNode(s2.type);

  //   const res1 = reifyType({ type: t1, checker, ctx: ctx() });
  //   const res2 = reifyType({ type: t2, checker, ctx: ctx() });

  //   // 💎 Memory efficiency check
  //   expect(res1).toBe(res2);
  // });

  it('should fall through to generic intersection if no __brand is present', () => {
    const { type, checker } = reifyTypeContext(
      'type Combined = { a: string } & { b: number };',
    );

    const result = reifyType({ type, checker, ctx: ctx() });

    // Verifies that 'branded' reifier returned undefined and
    // let 'intersections' reifier take over.
    expect(result.kind).toBe('intersection');
  });
});

// describe('Branded Reifier (Integrated)', () => {
//   it('should identify a branded string literal intersection', () => {
//     const { type, checker } = reifyTypeContext(
//       'type UserId = string & { __brand: "UserId" };',
//     );
//     const result = reifyType(type, checker);

//     expect(result).toEqual({
//       kind: 'branded',
//       name: 'UserId',
//       base: { kind: 'primitive', type: 'string' },
//     });
//   });

//   it('should identify a branded object (Flattened Interface)', () => {
//     const { type, checker } = reifyTypeContext(`
//       interface User { id: number }
//       type SolidUser = User & { __brand: "SolidUser" };
//     `);

//     const result = reifyType(type, checker);

//     expect(result.kind).toBe('branded');
//     const branded = result as any;

//     expect(branded.name).toBe('SolidUser');
//     expect(branded.base.kind).toBe('object');
//     expect(branded.base.properties.id.shape).toEqual({
//       kind: 'primitive',
//       type: 'number',
//     });
//   });

//   it('should identify a branded object (Pure Type Literal)', () => {
//     const { type, checker } = reifyTypeContext(`
//       type SolidProfile = { username: string } & { __brand: "Profile" };
//     `);

//     const result = reifyType(type, checker);

//     expect(result.kind).toBe('branded');
//     const branded = result as any;

//     expect(branded.name).toBe('Profile');
//     expect(branded.base.kind).toBe('object');
//   });

//   it('should handle ambient global TSolid branding', () => {
//     // This assumes your test-utils.ts now injects the TSolid global definition
//     const { type, checker } = reifyTypeContext(`
//       type AmbientUser = TSolid<"GlobalKey", { age: number }>;
//     `);

//     const result = reifyType(type, checker);

//     expect(result.kind).toBe('branded');
//     const branded = result as any;

//     expect(branded.name).toBe('GlobalKey');
//     expect(branded.base.kind).toBe('object');
//   });

//   it('should fall through to generic intersection if no __brand is present', () => {
//     const { type, checker } = reifyTypeContext(
//       'type Combined = { a: string } & { b: number };',
//     );
//     const result = reifyType(type, checker);

//     // Verifies that 'branded' reifier returned undefined and
//     // let 'intersections' reifier take over.
//     expect(result.kind).toBe('intersection');
//   });
// });
