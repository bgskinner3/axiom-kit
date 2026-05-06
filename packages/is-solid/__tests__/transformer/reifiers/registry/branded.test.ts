// __tests__/unit/reifiers/branded.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { createTestType } from '../../../test-utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Branded Reifier (Integrated)', () => {
  it('should identify a branded string', () => {
    const { type, checker } = createTestType(
      'type UserId = string & { __brand: "UserId" };',
    );
    const result = reifyType(type, checker);

    expect(result).toEqual({
      kind: 'branded',
      name: 'UserId',
      base: { kind: 'primitive', type: 'string' },
    });
  });

  it('should identify a branded object', () => {
    const { type, checker } = createTestType(`
      interface User { id: number }
      type SolidUser = User & { __brand: "SolidUser" };
    `);
    const result = reifyType(type, checker);

    expect(result.kind).toBe('branded');
    const branded = result as any;

    expect(branded.name).toBe('SolidUser');
    expect(branded.base.kind).toBe('object');
    expect(branded.base.properties.id.shape).toEqual({
      kind: 'primitive',
      type: 'number',
    });
  });

  it('should fall through to intersection if no brand is present', () => {
    // This ensures that normal intersections are still handled
    const { type, checker } = createTestType(
      'type Combined = { a: string } & { b: number };',
    );
    const result = reifyType(type, checker);

    expect(result.kind).toBe('intersection');
  });
});
