import { normalizeImageSrc } from '../../src';

describe('normalizeImageSrc', () => {
  // 1. Basic Strings
  it('returns a plain string URL as-is', () => {
    const url = 'https://example.com';
    expect(normalizeImageSrc(url)).toBe(url);
    expect(normalizeImageSrc('/static/logo.svg')).toBe('/static/logo.svg');
  });

  // 2. Objects with src property (Static Imports)
  it('extracts src from a standard object (e.g., Next.js StaticImageData)', () => {
    const imgObj = {
      src: '/_next/static/media/photo.jpg',
      height: 100,
      width: 100,
    };
    expect(normalizeImageSrc(imgObj)).toBe('/_next/static/media/photo.jpg');
  });

  // 3. Bundler Default Exports (CommonJS Interop)
  it('extracts src from a nested default object (Bundler/CJS)', () => {
    const bundlerImport = {
      default: {
        src: '/assets/hero.png',
        width: 800,
      },
    };
    expect(normalizeImageSrc(bundlerImport)).toBe('/assets/hero.png');
  });

  // 4. Nullish and Empty Values
  it('returns an empty string for null, undefined, or empty input', () => {
    expect(normalizeImageSrc(null)).toBe('');
    expect(normalizeImageSrc(undefined)).toBe('');
    expect(normalizeImageSrc('')).toBe('');
  });

  // 5. Edge Cases & Invalid Objects
  it('returns an empty string for invalid object structures', () => {
    // Missing 'src'
    expect(normalizeImageSrc({ height: 10 } as any)).toBe('');
    // Not an object or string
    expect(normalizeImageSrc(123 as any)).toBe('');
    // 'default' exists but doesn't have 'src'
    expect(normalizeImageSrc({ default: { foo: 'bar' } } as any)).toBe('');
  });
});
