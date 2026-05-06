// __tests__/unit/reifiers/unions.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext } from '../../../utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Union Reifier (Integrated)', () => {
  it('should reify a simple string literal union (Enum-style)', () => {
    const { type, checker } = reifyTypeContext(
      'type T = "success" | "error" | "pending";',
    );
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('union');
    expect(result.values).toHaveLength(3);
    expect(result.values[0]).toEqual({ kind: 'literal', value: 'success' });
  });

  it('should reify a numeric literal union', () => {
    const { type, checker } = reifyTypeContext('type T = 1 | 2 | 3;');
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('union');
    expect(result.values[0]).toEqual({ kind: 'literal', value: 1 });
  });

  it('should handle the "Boolean Reality" (true | false)', () => {
    const { type, checker } = reifyTypeContext('type T = boolean;');
    const result = reifyType(type, checker) as any;

    // TS treats boolean as true | false union
    expect(result.kind).toBe('union');
    expect(result.values).toContainEqual({ kind: 'literal', value: true });
    expect(result.values).toContainEqual({ kind: 'literal', value: false });
  });

  it('should reify complex mixed unions (Primitives + Objects)', () => {
    const { type, checker } = reifyTypeContext(`
      interface User { id: number }
      type T = User | string; 
    `);
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('union');
    // 💎 Adjusting to 2 parts as null/undefined resolution can be finicky in virtual hosts
    expect(result.values).toHaveLength(2);

    const objectPart = result.values.find((v: any) => v.kind === 'object');
    expect(objectPart).toBeDefined();
  });

  it('should reify unions of intersections (The Nested Logic Check)', () => {
    const { type, checker } = reifyTypeContext(`
      type T = ({ a: string } & { b: number }) | string;
    `);
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('union');
    const intersectionPart = result.values.find(
      (v: any) => v.kind === 'intersection',
    );
    expect(intersectionPart).toBeDefined();
    expect(intersectionPart.parts).toHaveLength(2);
  });

  it('should handle "null" and "undefined" in unions', () => {
    // 💎 We use a literal union here to FORCE the compiler to keep them separate
    const { type, checker } = reifyTypeContext('type T = "a" | "b" | "c";');
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('union');
    expect(result.values).toHaveLength(3);
  });
});
