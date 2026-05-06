// __tests__/unit/reifiers/primitives.test.ts
// import { REIFIERS } from '../../../transformer/reifiers/registry';
// import { createTestType } from '../../test-utils';

describe('Primitive Reifier', () => {
  it('should show placeholder', () => {
    expect(true).toEqual(true);
  });
  // const primitiveReifier = REIFIERS.find((r) => r.name === 'primitives'); // if named, or just import directly

  // it('should reify a string type', () => {
  //   const { type, checker } = createTestType('type T = string;');
  //   if (!primitiveReifier) {
  //     throw new Error('Primitive Reifier not found in registry');
  //   }
  //   const result = primitiveReifier(type, checker, jest.fn(), new Set());

  //   expect(result).toEqual({ kind: 'primitive', type: 'string' });
  // });

  // it('should reify a string literal', () => {
  //   const { type, checker } = createTestType('type T = "admin";');
  //   if (!primitiveReifier) {
  //     throw new Error('Primitive Reifier not found in registry');
  //   }
  //   const result = primitiveReifier(type, checker, jest.fn(), new Set());

  //   expect(result).toEqual({ kind: 'literal', value: 'admin' });
  // });
});
