// __tests__/unit/reifiers/array.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext } from '../../../utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Array Reifier (Integrated)', () => {
  it('should reify a simple primitive array', () => {
    const { type, checker } = reifyTypeContext('type T = string[];');
    const result = reifyType(type, checker);

    expect(result).toEqual({
      kind: 'array',
      items: { kind: 'primitive', type: 'string' },
    });
  });

  it('should reify nested 2D arrays (Depth Check)', () => {
    const { type, checker } = reifyTypeContext('type T = number[][];');
    const result = reifyType(type, checker);

    expect(result).toEqual({
      kind: 'array',
      items: {
        kind: 'array',
        items: { kind: 'primitive', type: 'number' },
      },
    });
  });

  it('should reify an array of complex objects (Integration Check)', () => {
    const { type, checker } = reifyTypeContext('type T = { id: string }[];');
    const result = reifyType(type, checker);

    expect(result.kind).toBe('array');
    const items = (result as any).items;

    // Proves the Array reifier successfully handed off to the Object reifier
    expect(items.kind).toBe('object');
    expect(items.properties.id.shape).toEqual({
      kind: 'primitive',
      type: 'string',
    });
  });

  it('should reify an array containing unions', () => {
    const { type, checker } = reifyTypeContext(
      'type T = (string | boolean)[];',
    );
    const result = reifyType(type, checker);

    expect(result).toEqual({
      kind: 'array',
      items: {
        kind: 'union',
        values: [
          { kind: 'primitive', type: 'string' },
          // 💎 TypeScript splits boolean into true | false literals
          { kind: 'literal', value: false },
          { kind: 'literal', value: true },
        ],
      },
    });
  });

  it('should handle ReadonlyArray syntax', () => {
    const { type, checker } = reifyTypeContext(
      'type T = ReadonlyArray<number>;',
    );
    const result = reifyType(type, checker);

    expect(result).toEqual({
      kind: 'array',
      items: { kind: 'primitive', type: 'number' },
    });
  });
});
