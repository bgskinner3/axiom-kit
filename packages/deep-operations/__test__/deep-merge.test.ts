import { mergeDeepArray, mergeDeep } from '../src/deep-merge';

describe('Deep Merge Utilities', () => {
  describe('mergeDeepArray', () => {
    it('should deeply merge multiple nested objects in an array', () => {
      const sources = [
        { a: 1, b: { c: 1 } },
        { b: { d: 2 }, e: 3 },
        { a: 5, b: { c: 10 } },
      ];
      const result = mergeDeepArray(sources);
      expect(result).toEqual({
        a: 5,
        b: { c: 10, d: 2 },
        e: 3,
      });
    });

    it('should return an empty object when the array is empty', () => {
      expect(mergeDeepArray([])).toEqual({});
    });

    it('should handle non-object values by skipping them', () => {
      // @ts-expect-error - Testing runtime resilience
      const result = mergeDeepArray([{ a: 1 }, null, undefined, 42, { b: 2 }]);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('mergeDeep (Variadic)', () => {
    it('should merge objects passed as separate arguments', () => {
      const result = mergeDeep({ a: 1 }, { b: 2 }, { a: 99 });
      expect(result).toEqual({ a: 99, b: 2 });
    });
  });

  describe('Edge Cases', () => {
    it('should not mutate the original source objects', () => {
      const base = { nested: { val: 1 } };
      const extension = { nested: { val: 2 } };
      mergeDeep(base, extension);
      expect(base.nested.val).toBe(1);
    });

    it('should handle circular references gracefully', () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;

      const obj2 = { b: 2 };

      // If your mergeHelper handles circularity, it should not stack overflow
      const result = mergeDeep(obj1, obj2);
      expect(result.b).toBe(2);

      console.log(result, '\n\n\n\nn\n');
      expect(result.self).toBe(result);
    });

    it('should overwrite arrays instead of merging them (standard behavior)', () => {
      const obj1 = { list: [1, 2] };
      const obj2 = { list: [3] };
      const result = mergeDeep(obj1, obj2);
      expect(result.list).toEqual([3]);
    });

    it('should work with objects that have no prototype (Object.create(null))', () => {
      const noProto = Object.create(null);
      noProto.a = 1;
      const result = mergeDeep({ b: 2 }, noProto);
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
    });

    it('should handle merging null or undefined properties correctly', () => {
      // Cast to any to check the runtime value of conflicting types
      const result = mergeDeep({ a: 1 }, { a: null as unknown }, { b: 2 });

      expect(result.a).toBeNull();
      expect(result.b).toBe(2);
    });
  });

  it('should handle deep circular references', () => {
    const obj1: any = { a: { b: { c: 1 } } };
    obj1.a.b.link = obj1.a; // Circular link to a nested node

    const obj2 = { d: 4 };
    const result = mergeDeep(obj1, obj2);

    expect(result.d).toBe(4);
    // Ensures the nested circular link points to the new merged 'a'
    expect(result.a.b.link).toBe(result.a);
  });

  it('should handle cross-object circular references', () => {
    const obj1 = { name: 'Object 1' };
    const obj2: any = { name: 'Object 2' };
    obj2.ref = obj1; // Second object points back to the first

    const result = mergeDeep(obj1, obj2);

    // If we are merging obj1 and obj2, any reference to obj1
    // should now point to the combined result
    expect(result.ref).toBe(result);
  });

  it('should overwrite a nested array with an object', () => {
    const obj1 = { data: [1, 2, 3] };
    const obj2 = { data: { key: 'value' } };
    const result = mergeDeep(obj1, obj2);

    expect(result.data).toEqual({ key: 'value' });
  });

  it('should handle Date objects as values rather than merging them', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2024-01-01');
    const result = mergeDeep({ d: date1 }, { d: date2 });

    expect(result.d).toBe(date2);
    expect(result.d instanceof Date).toBe(true);
  });

  it('should maintain the prototype of the first source', () => {
    class MyClass {
      protoMethod() {
        return 'working';
      }
    }
    const instance = new MyClass() as any;
    instance.a = 1;

    const result = mergeDeep(instance, { b: 2 }) as any;

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(typeof result.protoMethod).toBe('function');
    expect(result.protoMethod()).toBe('working');
  });
});
