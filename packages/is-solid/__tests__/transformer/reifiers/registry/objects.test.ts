// __tests__/unit/reifiers/objects.test.ts
import { reifyType } from '../../../../transformer/reifiers/reify-type';
import { reifyTypeContext } from '../../../utils';
// NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
import '../../../../transformer/reifiers/registry/index';

describe('Object Reifier (Integrated)', () => {
  it('should reify a simple interface with primitive properties', () => {
    const { type, checker } = reifyTypeContext(`
      interface IUser { 
        id: number; 
        name: string; 
      }
    `);
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('object');
    expect(result.properties.id.shape).toEqual({
      kind: 'primitive',
      type: 'number',
    });
    expect(result.properties.id.optional).toBe(false);
    expect(result.properties.name.shape).toEqual({
      kind: 'primitive',
      type: 'string',
    });
  });

  // it('should correctly identify optional properties', () => {
  //   const { type, checker } = reifyTypeContext(`
  //     interface IConfig {
  //       timeout: number;
  //       retry?: boolean;
  //     }
  //   `);
  //   const result = reifyType(type, checker) as any;

  //   expect(result.properties.timeout.optional).toBe(false);
  //   expect(result.properties.retry.optional).toBe(true);
  //   // Verify nested shape inside the optional property
  //   expect(result.properties.retry.shape.kind).toBe('literal');
  // });
  it('should correctly identify optional properties', () => {
    const { type, checker } = reifyTypeContext(`
      interface IConfig { 
        timeout: number;
        retry?: boolean; 
      }
    `);
    const result = reifyType(type, checker) as any;

    expect(result.properties.timeout.optional).toBe(false);
    expect(result.properties.retry.optional).toBe(true);

    // 💎 FIX: TS sees boolean as false | true (a Union of Literals)
    expect(result.properties.retry.shape.kind).toBe('union');
    expect(result.properties.retry.shape.values[0].kind).toBe('literal');
  });

  it('should handle circular references (Infinite Loop Protection)', () => {
    const { type, checker } = reifyTypeContext(`
      interface INode { 
        next: INode; 
      }
    `);
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('object');
    // The recursive property MUST be a reference to prevent stack overflow
    expect(result.properties.next.shape.kind).toBe('reference');
    expect(result.properties.next.shape.name).toBe('INode');
  });

  it('should reify deeply nested object structures', () => {
    const { type, checker } = reifyTypeContext(`
      type Deep = { a: { b: { c: string } } };
    `);
    const result = reifyType(type, checker) as any;

    const levelA = result.properties.a.shape;
    const levelB = levelA.properties.b.shape;
    const levelC = levelB.properties.c.shape;

    expect(levelC).toEqual({ kind: 'primitive', type: 'string' });
  });

  it('should reify inherited properties from extended interfaces', () => {
    const { type, checker } = reifyTypeContext(`
      interface Base { id: string }
      interface Admin extends Base { role: 'admin' }
    `);
    const result = reifyType(type, checker) as any;

    // Proves checker.getPropertiesOfType() flattens the heritage tree
    expect(result.properties.id).toBeDefined();
    expect(result.properties.role).toBeDefined();
    expect(result.properties.role.shape.value).toBe('admin');
  });

  it('should handle anonymous type literals', () => {
    const { type, checker } = reifyTypeContext(`
      type T = { [key: string]: any; name: string };
    `);
    const result = reifyType(type, checker) as any;

    expect(result.kind).toBe('object');
    expect(result.properties.name).toBeDefined();
  });
});
