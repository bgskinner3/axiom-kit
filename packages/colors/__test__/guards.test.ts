import { isHexColor, isRGBTuple, isTuple3, isRGBString } from '../src';

describe('Color Type Guards', () => {
  describe('isHexColor', () => {
    it('returns true for valid 3-digit and 6-digit hex colors', () => {
      // 3-digit hex
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#ABC')).toBe(true);
      // 6-digit hex
      expect(isHexColor('#123456')).toBe(true);
      expect(isHexColor('#abcdef')).toBe(true);
      expect(isHexColor('#ABCDEF')).toBe(true);
    });

    it('returns false for invalid hex colors', () => {
      // Too short / too long
      expect(isHexColor('#ff')).toBe(false);
      expect(isHexColor('#12345')).toBe(false);
      expect(isHexColor('#1234567')).toBe(false);

      // Invalid characters
      expect(isHexColor('#12G')).toBe(false);
      expect(isHexColor('#12345Z')).toBe(false);

      // Missing #
      expect(isHexColor('123456')).toBe(false);
      expect(isHexColor('fff')).toBe(false);

      // Non-string types
      expect(isHexColor(null)).toBe(false);
      expect(isHexColor(undefined)).toBe(false);
      expect(isHexColor(123456)).toBe(false);
      expect(isHexColor({})).toBe(false);

      // Empty string
      expect(isHexColor('')).toBe(false);
    });

    it('handles edge cases with mixed case', () => {
      expect(isHexColor('#AbC')).toBe(true);
      expect(isHexColor('#aBcDeF')).toBe(true);
    });
  });

  describe('isRGBTuple', () => {
    it('returns true for valid RGB arrays', () => {
      expect(isRGBTuple([0, 128, 255])).toBe(true);
    });
    it('returns false for invalid RGB arrays', () => {
      expect(isRGBTuple([0, -1, 255])).toBe(false);
      expect(isRGBTuple([0, 128])).toBe(false);
      expect(isRGBTuple([0, 128, 256])).toBe(false);
      expect(isRGBTuple(['0', 128, 255])).toBe(false);
    });
  });
  describe('isTuple3', () => {
    it('returns true for valid [number, number, number] tuples', () => {
      expect(isTuple3([0, 0, 0])).toBe(true);
      expect(isTuple3([255, 128, 64])).toBe(true);
    });

    it('returns false if any element is NaN or not a number', () => {
      // 🛑 Hits the inner: typeof v !== 'number'
      expect(isTuple3([0, '128', 0])).toBe(false);
      // 🛑 Hits the inner: !Number.isNaN(v)
      expect(isTuple3([0, NaN, 0])).toBe(false);
    });

    it('returns false for incorrect lengths', () => {
      // 🛑 Hits: value.length !== 3
      expect(isTuple3([0, 0])).toBe(false);
      expect(isTuple3([0, 0, 0, 0])).toBe(false);
    });

    it('returns false for non-arrays', () => {
      // 🛑 Hits: isArray check
      expect(isTuple3(null)).toBe(false);
      expect(isTuple3({ r: 0, g: 0, b: 0 })).toBe(false);
    });
  });

  describe('isRGBString', () => {
    it('returns true for valid RGB strings', () => {
      expect(isRGBString('rgb(0,0,0)')).toBe(true);
      expect(isRGBString('rgb(255,255,255)')).toBe(true);
      expect(isRGBString('rgb(128, 64, 32)')).toBe(true);
      expect(isRGBString('RGB(12,34,56)')).toBe(true); // case-insensitive
      expect(isRGBString('rgb( 12 , 34 , 56 )')).toBe(true); // spaces allowed
    });

    it('returns false for RGB strings with out-of-range values', () => {
      expect(isRGBString('rgb(256,0,0)')).toBe(false);
      expect(isRGBString('rgb(-1,0,0)')).toBe(false);
      expect(isRGBString('rgb(0,0,300)')).toBe(false);
    });

    it('returns false for RGB strings with invalid formats', () => {
      expect(isRGBString('rgb(0,0)')).toBe(false);
      expect(isRGBString('rgb(0;0;0)')).toBe(false);
      expect(isRGBString('rgb(0 0 0)')).toBe(false); // Still false (missing commas)
    });

    it('returns false for non-string values', () => {
      expect(isRGBString(null)).toBe(false);
      expect(isRGBString(undefined)).toBe(false);
      expect(isRGBString(123)).toBe(false);
      expect(isRGBString([255, 0, 0])).toBe(false); // array is not string
      expect(isRGBString({ r: 0, g: 0, b: 0 })).toBe(false);
    });

    it('returns false for empty string or nonsense', () => {
      expect(isRGBString('')).toBe(false);
      expect(isRGBString('not a color')).toBe(false);
      expect(isRGBString('rgb(abc,def,ghi)')).toBe(false);
    });
  });
});
