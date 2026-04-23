import { extractRelativePath } from '../../src';

describe('extractRelativePath', () => {
  // 1. Internal Absolute URLs
  // it('extracts the pathname from absolute internal URLs', () => {
  //   // Assuming your isInternalUrl guard allows these
  //   expect(extractRelativePath('https://axiom-kit.com/docs/guides')).toBe(
  //     '/docs/guides',
  //   );
  //   expect(extractRelativePath('http://localhost:3000/dashboard')).toBe(
  //     '/dashboard',
  //   );
  // });

  // 2. Relative Paths
  it('returns relative paths as-is if they start with a slash', () => {
    expect(extractRelativePath('/settings/profile')).toBe('/settings/profile');
  });

  it('adds a leading slash if the path is missing one', () => {
    expect(extractRelativePath('blog/post-1')).toBe('/blog/post-1');
  });

  // 3. Fallbacks and Invalid Inputs
  it('returns "/" for external URLs', () => {
    // Assuming isInternalUrl returns false for external domains
    expect(extractRelativePath('https://google.com')).toBe('/');
  });

  it('returns "/" for empty, null, or undefined values', () => {
    expect(extractRelativePath('')).toBe('/');
    expect(extractRelativePath(null)).toBe('/');
    expect(extractRelativePath(undefined)).toBe('/');
  });

  it('handles query parameters and hashes correctly (based on your logic)', () => {
    // Note: parsed.pathname does NOT include ?query or #hash
    expect(extractRelativePath('/docs?id=123')).toBe('/docs');
  });
});
