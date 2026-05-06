// __tests__/unit/reifiers/primitives.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext } from '../../../utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Primitive Reifier (Integrated)', () => {
  it('should reify all base primitives', () => {
    // Split boolean out because it reifies as a Union
    // TODO: NOTE boolean type is not a primitive; it is a shorthand for the union true | false!!
    const basicPrimitives = ['string', 'number', 'bigint'];

    basicPrimitives.forEach((t) => {
      const { type, checker } = reifyTypeContext(`type T = ${t};`);
      const result = reifyType(type, checker);
      expect(result).toEqual({ kind: 'primitive', type: t });
    });

    // SPECIAL TESY CASE: Test boolean specifically as the union it truly is
    const { type, checker } = reifyTypeContext(`type T = boolean;`);
    const result = reifyType(type, checker);
    expect(result).toEqual({
      kind: 'union',
      values: [
        { kind: 'literal', value: false },
        { kind: 'literal', value: true },
      ],
    });
  });

  it('should reify specific string literals', () => {
    const { type, checker } = reifyTypeContext('type T = "admin";');
    const result = reifyType(type, checker);
    expect(result).toEqual({ kind: 'literal', value: 'admin' });
  });

  it('should reify specific numeric literals', () => {
    const { type, checker } = reifyTypeContext('type T = 42;');
    const result = reifyType(type, checker);
    expect(result).toEqual({ kind: 'literal', value: 42 });
  });

  it('should reify boolean literals (true / false)', () => {
    const { type, checker } = reifyTypeContext('type T = true;');
    const result = reifyType(type, checker);
    expect(result).toEqual({ kind: 'literal', value: true });
  });

  it('should handle null and undefined as unknown primitives', () => {
    const units = ['null', 'undefined'];

    units.forEach((u) => {
      const { type, checker } = reifyTypeContext(`type T = ${u};`);
      const result = reifyType(type, checker);
      // Based on our previous fix, these map to unknown for the vault
      expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
    });
  });

  it('should fallback to unknown for "any" or "unknown"', () => {
    const fallbacks = ['any', 'unknown'];

    fallbacks.forEach((f) => {
      const { type, checker } = reifyTypeContext(`type T = ${f};`);
      const result = reifyType(type, checker);
      expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
    });
  });
});
