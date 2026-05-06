// __tests__/unit/reifiers/objects.test.ts
// import { REIFIERS } from '../../../transformer/reifiers/registry';
// import { createTestType } from '../../test-utils';
// import { TSolidShape } from '../../../models/types';

describe('Object Reifier', () => {
  it('should show placeholder', () => {
    expect(true).toEqual(true);
  });
  // const objectReifier = REIFIERS.find((r) => r.name === 'objects');

  // it('should reify a simple interface', () => {
  //   if (!objectReifier) throw new Error('Object Reifier not found');

  //   const { type, checker } = createTestType(`
  //     interface IUser {
  //       id: number;
  //       name: string;
  //     }
  //   `);

  //   // Mock next to return a simple primitive shape for properties
  //   const mockNext = jest.fn((_t) => ({
  //     kind: 'primitive' as const,
  //     type: 'unknown' as const,
  //   }));

  //   const result = objectReifier(type, checker, mockNext, new Set());

  //   expect(result?.kind).toBe('object');
  //   const obj = result as Extract<TSolidShape, { kind: 'object' }>;

  //   expect(obj.properties['id']).toBeDefined();
  //   expect(obj.properties['name']).toBeDefined();
  //   expect(mockNext).toHaveBeenCalledTimes(2);
  // });

  // it('should identify optional properties', () => {
  //   if (!objectReifier) throw new Error('Object Reifier not found');

  //   const { type, checker } = createTestType(`
  //     interface IConfig {
  //       retry?: boolean;
  //     }
  //   `);

  //   const result = objectReifier(
  //     type,
  //     checker,
  //     jest.fn(() => ({ kind: 'primitive', type: 'boolean' })),
  //     new Set(),
  //   );
  //   const obj = result as Extract<TSolidShape, { kind: 'object' }>;

  //   expect(obj.properties['retry'].optional).toBe(true);
  // });

  // it('should handle circular references (The Vault Safety)', () => {
  //   if (!objectReifier) throw new Error('Object Reifier not found');

  //   const { type, checker } = createTestType(`
  //     interface INode {
  //       next: INode;
  //     }
  //   `);

  //   const seen = new Set<any>();
  //   // The first call happens manually
  //   // The second call (recursive) is what we want to test
  //   const result = objectReifier(
  //     type,
  //     checker,
  //     (t) => objectReifier(t, checker, jest.fn(), seen)!,
  //     seen,
  //   );

  //   expect(result?.kind).toBe('object');
  //   const obj = result as any;

  //   // The 'next' property should be a 'reference' kind because INode was in 'seen'
  //   expect(obj.properties['next'].shape.kind).toBe('reference');
  //   expect(obj.properties['next'].shape.name).toBe('INode');
  // });
});
