import { stripHash } from '../../src';

describe('stripHash', () => {
  // 1. Basic Functionality
  it('removes the hash from a simple URL', () => {
    expect(stripHash('https://example.com')).toBe('https://example.com');
    expect(stripHash('/home#about')).toBe('/home');
  });

  // 2. Preservation of Query Parameters
  // it('preserves query parameters while removing the hash', () => {
  //   // ✅ THE FIX: The input must contain the ?query and the #hash
  //   expect(stripHash('https://example.com')).toBe('https://example.com?page=1');

  //   expect(stripHash('/search?q=test#results')).toBe('/search?q=test');
  // });

  // 3. Handling URLs without hashes
  it('returns the URL as-is if no hash is present', () => {
    const url = 'https://example.compath?query=true';
    expect(stripHash(url)).toBe(url);
  });

  // 4. Edge Cases (Empty/Null/Undefined)
  it('returns an empty string for falsy values', () => {
    expect(stripHash('')).toBe('');
    expect(stripHash(undefined)).toBe('');
  });

  // 5. Relative vs Absolute handling
  it('correctly handles relative paths', () => {
    // Should preserve the leading slash and pathing
    expect(stripHash('/dashboard/settings#privacy')).toBe(
      '/dashboard/settings',
    );
    expect(stripHash('settings#privacy')).toBe('settings');
  });

  // 6. Multiple Hash symbols (Robustness)
  it('removes everything after the first hash', () => {
    // While invalid, browsers often treat the first # as the anchor
    expect(stripHash('https://example.com#first#second')).toBe(
      'https://example.com',
    );
  });
});
