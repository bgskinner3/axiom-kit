// __tests__/unit/reifiers/intersections.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext } from '../../../utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Intersection Reifier (Integrated)', () => {
  it('should reify a basic object intersection', () => {
    const { type, checker } = reifyTypeContext(`
      type Combined = { a: string } & { b: number };
    `);
    const result = reifyType(type, checker);

    expect(result.kind).toBe('intersection');
    const intersection = result as any;

    expect(intersection.parts.length).toBe(2);
    expect(intersection.parts[0].kind).toBe('object');
    expect(intersection.parts[1].kind).toBe('object');
  });

  it('should handle multi-part intersections (3+ parts)', () => {
    const { type, checker } = reifyTypeContext(`
      type Triple = { a: 1 } & { b: 2 } & { c: 3 };
    `);
    const result = reifyType(type, checker);
    const intersection = result as any;

    expect(intersection.parts.length).toBe(3);
  });

  it('should reify deep nested intersections', () => {
    const { type, checker } = reifyTypeContext(`
      type Deep = { outer: { a: string } & { b: number } };
    `);
    const result = reifyType(type, checker);

    // Navigate to the 'outer' property
    const outerShape = (result as any).properties.outer.shape;

    expect(outerShape.kind).toBe('intersection');
    expect(outerShape.parts.length).toBe(2);
  });

  it('should verify that Branded types are NOT treated as generic intersections', () => {
    // This is the most important "Negative" test.
    // It proves that the Branded reifier (which is higher in index.ts)
    // intercepts the brand before the Intersection reifier sees it.
    const { type, checker } = reifyTypeContext(`
      type User = { id: number } & { __brand: "User" };
    `);
    const result = reifyType(type, checker);

    expect(result.kind).toBe('branded');
    expect(result.kind).not.toBe('intersection');
  });
  it('should reify intersections of mixed primitives and objects', () => {
    // This happens in certain "Tagging" patterns
    const { type, checker } = reifyTypeContext(`
      type Tagged = string & { _tag: 'metadata' };
    `);
    const result = reifyType(type, checker);
    const intersection = result as any;

    expect(intersection.kind).toBe('intersection');
    // Part 0 should be the primitive string
    expect(intersection.parts[0].kind).toBe('primitive');
    // Part 1 should be the object literal
    expect(intersection.parts[1].kind).toBe('object');
  });

  it('should reify intersections containing unions (Distributed Logic)', () => {
    const { type, checker } = reifyTypeContext(`
    type Complex = { id: number } & ("A" | "B");
  `);
    const result = reifyType(type, checker);

    // 💎 Reality Check: TS distributes intersections over unions
    expect(result.kind).toBe('union');

    const union = result as any;
    expect(union.values[0].kind).toBe('intersection');
    expect(union.values[0].parts[0].kind).toBe('object');
    expect(union.values[0].parts[1].kind).toBe('literal');
  });

  /**
   * ALIAS CASE
   * !!! TESTING  if a user defines a base type and extends it via an alias, the Miner won't go blind
   */
  it('should reify intersections involving named type aliases (Alias Resolution)', () => {
    const { type, checker } = reifyTypeContext(`
      type Base = { id: number };
      type Extended = Base & { name: string };
    `);
    const result = reifyType(type, checker);

    // This proves the reifier used 'aliasSymbol' to find the underlying intersection
    expect(result.kind).toBe('intersection');
    const intersection = result as any;

    expect(intersection.parts[0].kind).toBe('object');
    expect(intersection.parts[1].kind).toBe('object');
    expect(intersection.parts[0].properties.id).toBeDefined();
  });
});
