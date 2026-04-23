import {
  hexToRGB,
  interpolateColor,
  hexToRGBShorthand,
  hexToHSL,
  hexToNormalizedRGB,
  validateRGB,
  getLuminance,
} from '../src/utils';

describe('Color Utilities', () => {
  describe('hexToRGB', () => {
    it('parses hex with #', () => {
      expect(hexToRGB('#ff0000')).toEqual([255, 0, 0]);
    });

    it('parses hex without #', () => {
      expect(hexToRGB('00ff00')).toEqual([0, 255, 0]);
    });

    it('throws on invalid hex', () => {
      expect(() => hexToRGB('#zzz')).toThrow();
      expect(() => hexToRGB('12345')).toThrow();
    });
  });

  describe('interpolateColor', () => {
    it('interpolates halfway', () => {
      const result = interpolateColor(
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
        0.5,
      );

      expect(result).toBe('rgb(128, 128, 128)');
    });

    it('returns start color for factor 0', () => {
      const result = interpolateColor(
        { r: 10, g: 20, b: 30 },
        { r: 100, g: 200, b: 255 },
        0,
      );

      expect(result).toBe('rgb(10, 20, 30)');
    });

    it('returns end color for factor 1', () => {
      const result = interpolateColor(
        { r: 10, g: 20, b: 30 },
        { r: 100, g: 200, b: 255 },
        1,
      );

      expect(result).toBe('rgb(100, 200, 255)');
    });
  });
  describe('hexToRGBShorthand', () => {
    it('expands shorthand hex', () => {
      expect(hexToRGBShorthand('#abc')).toEqual([170, 187, 204]);
    });

    it('handles hex without #', () => {
      expect(hexToRGBShorthand('fff')).toEqual([255, 255, 255]);
    });

    it('returns null for invalid input', () => {
      expect(hexToRGBShorthand('#abcd')).toBeNull();
    });
  });

  describe('hexToHSL', () => {
    it('converts white correctly', () => {
      const { h, s, l } = hexToHSL('#ffffff');
      expect(h).toBeCloseTo(0); // hue is undefined for gray, default to 0
      expect(s).toBeCloseTo(0);
      expect(l).toBeCloseTo(1);
    });

    it('converts black correctly', () => {
      const { h, s, l } = hexToHSL('#000000');
      expect(h).toBeCloseTo(0);
      expect(s).toBeCloseTo(0);
      expect(l).toBeCloseTo(0);
    });

    it('converts red correctly', () => {
      const { h, s, l } = hexToHSL('#ff0000');
      expect(h).toBeCloseTo(0);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });

    it('converts green correctly', () => {
      const { h, s, l } = hexToHSL('#00ff00');
      expect(h).toBeCloseTo(120);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });

    it('converts blue correctly', () => {
      const { h, s, l } = hexToHSL('#0000ff');
      expect(h).toBeCloseTo(240);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });

    it('converts cyan correctly', () => {
      const { h, s, l } = hexToHSL('#00ffff');
      expect(h).toBeCloseTo(180);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });

    it('converts magenta correctly', () => {
      const { h, s, l } = hexToHSL('#ff00ff');
      expect(h).toBeCloseTo(300);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });

    it('converts yellow correctly', () => {
      const { h, s, l } = hexToHSL('#ffff00');
      expect(h).toBeCloseTo(60);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });
    it('converts a reddish-purple correctly (max is R and G < B)', () => {
      const { h } = hexToHSL('#ff0080');
      // R=255, G=0, B=128 -> Hue should be around 330
      expect(h).toBeCloseTo(329.88, 1);
    });

    // NEW: Hits the saturation calculation for Lightness > 0.5
    it('converts a light sky blue correctly (L > 0.5 saturation path)', () => {
      const { h, s, l } = hexToHSL('#80d4ff');
      expect(l).toBeGreaterThan(0.5);
      // Updated to match actual calculation: (255-128) is delta, etc.
      expect(h).toBeCloseTo(200.3, 1);
      expect(s).toBeCloseTo(1, 1);
    });

    // NEW: Hits the saturation calculation for Lightness <= 0.5
    it('converts a dark navy correctly (L <= 0.5 saturation path)', () => {
      const { h, s, l } = hexToHSL('#000080');
      expect(l).toBeLessThanOrEqual(0.5);
      expect(h).toBeCloseTo(240);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.25, 1);
    });

    it('converts gray shades correctly', () => {
      const { h, s, l } = hexToHSL('#808080'); // medium gray
      expect(h).toBeCloseTo(0);
      expect(s).toBeCloseTo(0);
      expect(l).toBeCloseTo(0.5);
    });

    it('accepts lowercase hex', () => {
      const { h, s, l } = hexToHSL('#ff00ff');
      expect(h).toBeCloseTo(300);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5);
    });
    it('converts a vivid purple correctly (max is Blue branch)', () => {
      // #8000ff -> R: 128, G: 0, B: 255
      const { h, s, l } = hexToHSL('#8000ff');

      // Calculation Breakdown:
      // r=0.501, g=0, b=1.0. Max is Blue (1.0).
      // d = 1.0 - 0 = 1.0
      // h = ((0.501 - 0) / 1.0 + 4) * 60 = 270.11
      expect(h).toBeCloseTo(270.1, 1);
      expect(s).toBeCloseTo(1);
      expect(l).toBeCloseTo(0.5, 1);
    });
  });

  describe('hexToNormalizedRGB', () => {
    it('normalizes RGB values', () => {
      expect(hexToNormalizedRGB('#ff0000')).toEqual([1, 0, 0]);
    });

    it('normalizes white', () => {
      expect(hexToNormalizedRGB('#ffffff')).toEqual([1, 1, 1]);
    });

    it('normalizes black', () => {
      expect(hexToNormalizedRGB('#000000')).toEqual([0, 0, 0]);
    });
  });

  describe('validateRGB', () => {
    it('accepts rgb tuple', () => {
      expect(validateRGB([10, 20, 30])).toEqual([10, 20, 30]);
    });

    it('converts hex string', () => {
      expect(validateRGB('#0000ff')).toEqual([0, 0, 255]);
    });
  });

  describe('getLuminance', () => {
    it('computes luminance for white', () => {
      expect(getLuminance([255, 255, 255])).toBeCloseTo(1, 5);
    });

    it('computes luminance for black', () => {
      expect(getLuminance([0, 0, 0])).toBeCloseTo(0, 5);
    });

    it('accepts hex input', () => {
      expect(getLuminance('#ffffff')).toBeCloseTo(1, 5);
    });
  });
});
