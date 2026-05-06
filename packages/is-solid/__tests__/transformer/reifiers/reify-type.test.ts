// __tests__/unit/refiy-types.test.ts
import { reifyType } from '../../../transformer/reifiers/reify-type';
import { createTestType } from '../../test-utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../transformer/reifiers/registry/index';

describe('ReifyType Orchestrator (The Dispatcher)', () => {
  it('should fall through to "unknown" when no reifiers match', () => {
    // 'any' is the ultimate wildcard that reifiers usually skip
    const { type, checker } = createTestType('type T = any;');
    const result = reifyType(type, checker);

    expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
  });

  it('should correctly orchestrate the "next" recursion (Depth Check)', () => {
    // This tests if reifyType correctly passes the 'next' baton
    // from an Object to a Primitive.
    const { type, checker } = createTestType('interface T { id: string }');
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('object');
    // Verify the recursive result of the 'id' property
    expect(result.properties.id.shape).toEqual({
      kind: 'primitive',
      type: 'string',
    });
  });

  it('should maintain the "seen" set to prevent stack overflow', () => {
    // This is the CRITICAL safety test.
    const { type, checker } = createTestType(`
      interface Node {
        val: number;
        child: Node;
      }
    `);

    // If the orchestrator doesn't pass 'seen' correctly,
    // this call will throw "Maximum call stack size exceeded"
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('object');
    expect(result.properties.child.shape.kind).toBe('reference');
    expect(result.properties.child.shape.name).toBe('Node');
  });

  it('should respect reifier priority (The Intersection/Branded Conflict)', () => {
    // Proves that 'branded' reifier (if registered first) wins over 'intersection'
    const { type, checker } = createTestType(`
      type Brand = string & { __brand: "ID" };
    `);
    const result = reifyType(type, checker);

    expect(result.kind).toBe('branded');
  });

  it('should handle deeply nested arrays and objects combined', () => {
    const { type, checker } = createTestType('type T = { items: string[] }[];');
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('array');
    expect(result.items.kind).toBe('object');
    expect(result.items.properties.items.shape.kind).toBe('array');
    expect(result.items.properties.items.shape.items.type).toBe('string');
  });
});
