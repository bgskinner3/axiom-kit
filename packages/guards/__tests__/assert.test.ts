import { makeAssert, assertValue } from '../src';

describe('Assertion Utilities', () => {
  const isString = (v: unknown): v is string => typeof v === 'string';
  const isNumber = (v: unknown): v is number => typeof v === 'number';

  describe('assertValue', () => {
    it('should not throw if the value passes the type guard', () => {
      expect(() => assertValue('hello', isString)).not.toThrow();
    });

    it('should throw the default error message if the guard fails', () => {
      const val = 123;
      expect(() => assertValue(val, isString)).toThrow(
        `Assertion failed: value 123 does not satisfy isString`,
      );
    });

    it('should throw a custom error message if provided', () => {
      const customMsg = 'This must be a string!';
      expect(() => assertValue(123, isString, customMsg)).toThrow(customMsg);
    });

    it('should handle anonymous guards gracefully in error messages', () => {
      // Anonymous guard has no .name property
      expect(() => assertValue({}, (_v: unknown): _v is any => false)).toThrow(
        /does not satisfy type guard/,
      );
    });
  });

  describe('makeAssert', () => {
    it('should create a reusable assertion function', () => {
      const assertAge = makeAssert(isNumber, 'age');

      expect(() => assertAge(25)).not.toThrow();
      expect(() => assertAge('25')).toThrow(
        'Validation failed for property: age',
      );
    });

    // it('should allow overriding the default message in the created function', () => {
    //   const assertName = makeAssert(isString, 'userName');
    //   const custom = 'User name is required and must be a string';

    //   expect(() => assertName(null, custom)).toThrow(custom);
    // });

    // it('should maintain closure over the key and guard', () => {
    //   const assertId = makeAssert(isNumber, 'id');
    //   const val: unknown = 500;

    //   assertId(val);
    //   // Logic check: if it didn't throw, we expect standard JS behavior to continue
    //   expect(val).toBe(500);
    // });
  });
});
