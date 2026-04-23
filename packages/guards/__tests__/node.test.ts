import { isStream, isBufferLikeObject } from '../src';

describe('Node Guards', () => {
  describe('isBufferLikeObject', () => {
    it('should return true for valid Buffer JSON structures', () => {
      const valid = {
        type: 'Buffer',
        data: [1, 2, 3, 255],
      };
      expect(isBufferLikeObject(valid)).toBe(true);
    });

    it('should return false if the type is not "Buffer"', () => {
      const invalid = { type: 'NotABuffer', data: [1] };
      expect(isBufferLikeObject(invalid)).toBe(false);
    });

    it('should return false if data is not an array of numbers', () => {
      const missingData = { type: 'Buffer' };
      const wrongData = { type: 'Buffer', data: ['1', '2'] };

      expect(isBufferLikeObject(missingData)).toBe(false);
      expect(isBufferLikeObject(wrongData)).toBe(false);
    });

    it('should return false for null or non-objects', () => {
      expect(isBufferLikeObject(null)).toBe(false);
      expect(isBufferLikeObject('{"type":"Buffer"}')).toBe(false);
    });
  });

  describe('isStream', () => {
    it('should return true for objects that implement pipe and on', () => {
      // Mocking a Node.js Stream signature
      const mockStream = {
        pipe: () => {},
        on: () => {},
        readable: true,
      };
      expect(isStream(mockStream)).toBe(true);
    });

    it('should return false if pipe or on is missing', () => {
      const missingOn = { pipe: () => {} };
      const missingPipe = { on: () => {} };

      expect(isStream(missingOn)).toBe(false);
      expect(isStream(missingPipe)).toBe(false);
    });

    it('should return false if properties are not functions', () => {
      const invalidTypes = {
        pipe: 'not-a-fn',
        on: true,
      };
      expect(isStream(invalidTypes)).toBe(false);
    });

    it('should handle null and primitives safely', () => {
      expect(isStream(null)).toBe(false);
      expect(isStream(undefined)).toBe(false);
      expect(isStream(123)).toBe(false);
    });
  });
});
