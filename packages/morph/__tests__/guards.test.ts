import { isCamelCase, isSnakeCase, isKebabCase } from '../src';

describe('Morph Type Guards', () => {
  describe('isCamelCase', () => {
    it('returns true for valid camelCase strings', () => {
      expect(isCamelCase('fooBar')).toBe(true);
      expect(isCamelCase('helloWorld123')).toBe(true);
    });
    it('returns false for non-camelCase strings', () => {
      expect(isCamelCase('FooBar')).toBe(false);
      expect(isCamelCase('foo_bar')).toBe(false);
      expect(isCamelCase('foo-bar')).toBe(false);
      expect(isCamelCase('')).toBe(false);
    });
  });

  describe('isSnakeCase', () => {
    it('returns true for valid snake_case strings', () => {
      expect(isSnakeCase('foo_bar')).toBe(true);
      expect(isSnakeCase('hello_world')).toBe(true);
    });
    it('returns false for non-snake_case strings', () => {
      expect(isSnakeCase('fooBar')).toBe(false);
      expect(isSnakeCase('foo-bar')).toBe(false);
      expect(isSnakeCase('')).toBe(false);
    });
  });

  describe('isKebabCase', () => {
    it('returns true for valid kebab-case strings', () => {
      expect(isKebabCase('foo-bar')).toBe(true);
      expect(isKebabCase('hello-world')).toBe(true);
    });
    it('returns false for non-kebab-case strings', () => {
      expect(isKebabCase('fooBar')).toBe(false);
      expect(isKebabCase('foo_bar')).toBe(false);
      expect(isKebabCase('')).toBe(false);
    });
  });
});
