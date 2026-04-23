import { getRefCurrent, mergeRefs } from '../../src/utils';

describe('React Ref Utils', () => {
  describe('mergeRefs', () => {
    it('updates both function and object refs', () => {
      const objRef = { current: null };
      const fnRef = jest.fn();
      const combined = mergeRefs(objRef, fnRef);

      const mockElement = { id: 'test' };
      combined(mockElement as any);

      expect(objRef.current).toBe(mockElement);
      expect(fnRef).toHaveBeenCalledWith(mockElement);
    });

    it('gracefully handles undefined refs', () => {
      const objRef = { current: null };
      const combined = mergeRefs(objRef, undefined);
      combined({} as any);
      expect(objRef.current).not.toBeNull();
    });
    it('updates an object ref specifically', () => {
      const objRef = { current: null };
      const combined = mergeRefs(objRef);

      const mockElement = { id: 'object-test' };
      combined(mockElement as any);

      // This forces the loop to skip the isFunction check and hit isRefObject
      expect(objRef.current).toBe(mockElement);
    });

    it('does not crash if an invalid ref type somehow passes the filter', () => {
      // This hits the "hidden" else branch of the if/else if logic
      // by passing something that isRef(ref) is true for, but isn't a function or obj.current
      // Although rare in TS, it ensures the loop completes safely.
      const weirdRef = Object.assign(() => {}, { current: undefined });
      delete (weirdRef as any).current;

      const combined = mergeRefs(weirdRef as any);
      expect(() => combined({} as any)).not.toThrow();
    });
    it('hits the isRefObject branch by using a non-function object ref', () => {
      // Create a "naked" object ref.
      // We explicitly ensure it is NOT a function so it fails the first 'if'.
      const objRef = { current: null };

      const combined = mergeRefs(objRef);
      const element = { nodeType: 1 };

      combined(element as any);

      expect(objRef.current).toBe(element);
    });
  });
  describe('getRefCurrent', () => {
    it('returns the value from a RefObject', () => {
      const mockElement = { id: 'test-el' };
      const objRef = { current: mockElement };

      const result = getRefCurrent(objRef);
      expect(result).toBe(mockElement);
    });

    it('returns null for function/callback refs', () => {
      const fnRef = jest.fn();

      // Callback refs are valid Ref types, but have no synchronous .current
      const result = getRefCurrent(fnRef);
      expect(result).toBeNull();
    });

    it('returns null for null or undefined refs', () => {
      expect(getRefCurrent(null)).toBeNull();
      expect(getRefCurrent(undefined)).toBeNull();
    });

    it('returns null if RefObject.current is not yet set', () => {
      const emptyRef = { current: null };
      expect(getRefCurrent(emptyRef)).toBeNull();
    });
  });
});
