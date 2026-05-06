// __tests__/unit/reifiers/intersections.test.ts
// import { reifyType } from '../../../../transformer/reifiers/reify-type';
// import { createTestType } from '../../../test-utils';
// // NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
// import '../../../../transformer/reifiers/registry/index';

describe('Intersection Reifier', () => {
  it('should show placeholder', () => {
    expect(true).toEqual(true);
  });
  // const intersectionReifier = REIFIERS.find((r) => r.name === 'intersections');

  // it('should reify a basic intersection', () => {
  //   if (!intersectionReifier) throw new Error('Intersection Reifier not found');

  //   const { type, checker } = createTestType(`
  //     type Combined = { a: string } & { b: number };
  //   `);

  //   const mockNext = jest.fn((_t) => ({
  //     kind: 'primitive' as const,
  //     type: 'string' as const,
  //   }));
  //   const result = intersectionReifier(type, checker, mockNext, new Set());

  //   expect(result?.kind).toBe('intersection');
  //   expect((result as any).parts.length).toBe(2);
  //   expect(mockNext).toHaveBeenCalledTimes(2);
  // });
});
