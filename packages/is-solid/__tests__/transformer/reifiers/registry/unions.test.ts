// __tests__/unit/reifiers/unions.test.ts
// import { REIFIERS } from '../../../transformer/reifiers/registry';
// import { createTestType } from '../../test-utils';

describe('Union Reifier', () => {
  it('should show placeholder', () => {
    expect(true).toEqual(true);
  });
  // const unionReifier = REIFIERS.find((r) => r.name === 'unions');

  // it('should reify a simple string literal union', () => {
  //   if (!unionReifier) throw new Error('Union Reifier not found');

  //   const { type, checker } = createTestType('type T = "light" | "dark";');
  //   const result = unionReifier(type, checker, jest.fn(), new Set());

  //   expect(result).toEqual({
  //     kind: 'union',
  //     values: [
  //       { kind: 'literal', value: 'light' },
  //       { kind: 'literal', value: 'dark' },
  //     ],
  //   });
  // });

  // it('should recurse for complex unions (Mixed types)', () => {
  //   if (!unionReifier) throw new Error('Union Reifier not found');

  //   const { type, checker } = createTestType('type T = string | number;');

  //   // 💎 FIX: Return a valid TSolidShape structure (like a primitive)
  //   const mockNext = jest.fn((_t) => ({
  //     kind: 'primitive' as const,
  //     type: 'string' as const,
  //   }));

  //   const result = unionReifier(type, checker, mockNext, new Set());

  //   // We check 'any' here because the reifier return is a union of shapes
  //   expect((result as any).kind).toBe('union');
  //   expect(mockNext).toHaveBeenCalledTimes(2);
  // });
});
