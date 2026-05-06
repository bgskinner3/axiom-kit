// __tests__/unit/refiy-types.test.ts
// import { reifyType } from '../../transformer/reifiers/reify-type';
// import { createTestType } from '../test-utils';

describe('ReifyType Dispatcher', () => {
  it('should show placeholder', () => {
    expect(true).toEqual(true);
  });
  // it('should fall through to unknown if no reifier matches', () => {
  //   const { type, checker } = createTestType('type T = any;');
  //   const result = reifyType(type, checker);

  //   expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
  // });

  // it('should correctly orchestrate a complex object', () => {
  //   const { type, checker } = createTestType('interface T { a: string }');
  //   const result = reifyType(type, checker);

  //   expect(result.kind).toBe('object');
  //   // Verifies that the object reifier successfully called 'next'
  //   // and reifyType dispatched it back to the primitive reifier.
  //   expect((result as any).properties.a.shape).toEqual({
  //     kind: 'primitive',
  //     type: 'string',
  //   });
  // });
});
