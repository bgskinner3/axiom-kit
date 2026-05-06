// __tests__/unit/reifiers/branded.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { createTestType } from '../../../test-utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';
describe('Branded Reifier (Integrated)', () => {
  it('should identify a branded string literal intersection', () => {
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

  it('should identify a branded object (Flattened Interface)', () => {
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

  it('should identify a branded object (Pure Type Literal)', () => {
    const { type, checker } = createTestType(`
      type SolidProfile = { username: string } & { __brand: "Profile" };
    `);

    const result = reifyType(type, checker);

    expect(result.kind).toBe('branded');
    const branded = result as any;

    expect(branded.name).toBe('Profile');
    expect(branded.base.kind).toBe('object');
  });

  it('should handle ambient global TSolid branding', () => {
    // This assumes your test-utils.ts now injects the TSolid global definition
    const { type, checker } = createTestType(`
      type AmbientUser = TSolid<"GlobalKey", { age: number }>;
    `);

    const result = reifyType(type, checker);

    expect(result.kind).toBe('branded');
    const branded = result as any;

    expect(branded.name).toBe('GlobalKey');
    expect(branded.base.kind).toBe('object');
  });

  it('should fall through to generic intersection if no __brand is present', () => {
    const { type, checker } = createTestType(
      'type Combined = { a: string } & { b: number };',
    );
    const result = reifyType(type, checker);

    // Verifies that 'branded' reifier returned undefined and
    // let 'intersections' reifier take over.
    expect(result.kind).toBe('intersection');
  });
});
