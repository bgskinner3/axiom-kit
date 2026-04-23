import { normalizeUrl } from '../../src';

describe('normalizeUrl', () => {
  it('handles strings and URL instances', () => {
    expect(normalizeUrl('https://axiom.dev')).toBe('https://axiom.dev');
    expect(normalizeUrl(new URL('https://axiom.dev'))).toBe(
      'https://axiom.dev',
    );
  });

  it('merges complex query objects with arrays', () => {
    const input = {
      pathname: '/search',
      query: { q: 'wizard', tags: ['ts', 'core'], empty: undefined },
    };
    expect(normalizeUrl(input)).toBe('/search?q=wizard&tags=ts&tags=core');
  });

  it('standardizes hashes', () => {
    expect(normalizeUrl({ pathname: '/', hash: 'top' })).toBe('/#top');
    expect(normalizeUrl({ pathname: '/', hash: '#top' })).toBe('/#top');
  });

  it('returns empty string for nullish inputs', () => {
    expect(normalizeUrl(null)).toBe('');
    expect(normalizeUrl(undefined)).toBe('');
  });
});
