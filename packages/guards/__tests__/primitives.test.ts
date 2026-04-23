import {
  isNumber,
  isInteger,
  isString,
  isNonEmptyString,
  isBoolean,
  isBigInt,
  isSymbol,
  isPrimitive,
  isNull,
  isUndefined,
  isNil,
  isDefined,
} from '../src';

describe('Primitive Type Guards', () => {
  describe('isNumber', () => {
    it('returns true for valid finite numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });
    it('returns false for NaN, Infinity, and non-numbers', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber('42')).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('returns true for integers only', () => {
      expect(isInteger(42)).toBe(true);
      expect(isInteger(-1)).toBe(true);
      expect(isInteger(3.14)).toBe(false);
    });
  });

  describe('isString', () => {
    it('returns true for strings only', () => {
      expect(isString('foo')).toBe(true);
      expect(isString(String(123))).toBe(true);
      expect(isString(123)).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('returns true for non-empty trimmed strings', () => {
      expect(isNonEmptyString('foo')).toBe(true);
    });
    it('returns false for empty or whitespace-only strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('returns true only for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(1)).toBe(false);
    });
  });

  describe('isBigInt', () => {
    it('returns true only for bigints', () => {
      expect(isBigInt(42n)).toBe(true);
      expect(isBigInt(BigInt('42'))).toBe(true);
      expect(isBigInt(42)).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('returns true only for symbols', () => {
      expect(isSymbol(Symbol('foo'))).toBe(true);
      expect(isSymbol('foo')).toBe(false);
    });
  });
  describe('isPrimitive', () => {
    it('returns true for all valid renderable primitives', () => {
      expect(isPrimitive('hello')).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(42n)).toBe(true);
    });

    it('returns false for complex objects and nil values', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(null)).toBe(false);
      expect(isPrimitive(undefined)).toBe(false);
    });

    it('returns false for non-finite numbers (NaN/Infinity)', () => {
      // Since isNumber(NaN) is false, isPrimitive(NaN) should be false
      expect(isPrimitive(NaN)).toBe(false);
      expect(isPrimitive(Infinity)).toBe(false);
    });
  });
  describe('isNull', () => {
    it('returns true only for null', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(false);
      expect(isNull({})).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('returns true only for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('returns false for null or undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
    it('returns true for all other values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined({})).toBe(true);
    });
  });

  describe('isNil', () => {
    it('returns true for null or undefined', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    });
    it('returns false otherwise', () => {
      expect(isNil(0)).toBe(false);
      expect(isNil('')).toBe(false);
      expect(isNil({})).toBe(false);
    });
  });
});
