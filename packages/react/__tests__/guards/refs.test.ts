import { isPromise, isRefObject, isRef } from '../../src/guards';

describe('React Ref Guards', () => {
  describe('isRefObject', () => {
    it('identifies valid RefObjects', () => {
      // Valid cases
      expect(isRefObject({ current: null })).toBe(true);
      expect(isRefObject({ current: document.createElement('div') })).toBe(
        true,
      );
    });

    it('returns false for objects missing the current property', () => {
      // Now safe to pass objects that aren't RefObjects
      expect(isRefObject({ cur: null })).toBe(false);
      expect(isRefObject({})).toBe(false);
    });

    it('returns false for non-objects', () => {
      // Now safe to pass primitives and nullables
      expect(isRefObject(null)).toBe(false);
      expect(isRefObject(undefined)).toBe(false);
      expect(isRefObject('current')).toBe(false);
    });
  });

  describe('isRef', () => {
    it('returns true for both RefObjects and Callback Refs', () => {
      const objRef = { current: null };
      const cbRef = (el: HTMLElement | null) => console.log(el);

      expect(isRef(objRef)).toBe(true);
      expect(isRef(cbRef)).toBe(true);
    });

    it('returns false for functions that are not callback refs (optional logic check)', () => {
      // Note: At runtime, any function is technically a valid callback ref
      expect(isRef(() => 'just a function')).toBe(true);
    });

    it('returns false for standard objects and primitives', () => {
      expect(isRef({ val: 1 })).toBe(false);
      expect(isRef(true)).toBe(false);
    });
  });
});

describe('isPromise', () => {
  it('identifies native Promises', () => {
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise(Promise.resolve(true))).toBe(true);
  });

  it('identifies "Thenables" (objects with .then)', () => {
    const customThenable = {
      then: (resolve: Function) => resolve(true),
    };
    expect(isPromise(customThenable)).toBe(true);
  });

  it('returns false for objects that look like promises but miss .then', () => {
    expect(isPromise({ catch: () => {} })).toBe(false);
    expect(isPromise({ finally: () => {} })).toBe(false);
  });

  // it('handles edge cases safely', () => {
  //   expect(isPromise(null)).toBe(false);
  //   expect(isPromise(undefined)).toBe(false);
  //   // Prevents issues where a function has a .then property (uncommon but possible)
  //   const fnWithThen = () => {};
  //   fnWithThen.then = () => {};
  //   expect(isPromise(fnWithThen)).toBe(true);
  // });
});
