/**
 * @jest-environment jsdom
 */
import { isAbsoluteUrl, isInternalUrl } from '../src';

describe('URL Guards', () => {
  describe('isAbsoluteUrl', () => {
    it('returns true for valid absolute URLs with protocols', () => {
      expect(isAbsoluteUrl('https://axiom.dev')).toBe(true);
      expect(isAbsoluteUrl('mailto:support@axiom.dev')).toBe(true);
      expect(isAbsoluteUrl('tel:+123456789')).toBe(true);
    });

    it('returns false for relative paths', () => {
      expect(isAbsoluteUrl('/dashboard')).toBe(false);
      expect(isAbsoluteUrl('./local-file')).toBe(false);
    });

    it('returns false for invalid strings or non-strings', () => {
      expect(isAbsoluteUrl('not-a-url')).toBe(false);
      expect(isAbsoluteUrl('')).toBe(false);
      expect(isAbsoluteUrl(null)).toBe(false);
    });
  });

  describe('isInternalUrl', () => {
    const ORIGIN = 'https://axiom.dev';

    it('identifies relative paths as internal', () => {
      expect(isInternalUrl('/settings')).toBe(true);
      expect(isInternalUrl('/')).toBe(true);
    });

    it('identifies absolute URLs matching the baseOrigin as internal', () => {
      expect(isInternalUrl('https://axiom.dev', ORIGIN)).toBe(true);
    });

    it('identifies absolute URLs matching window.location.origin', () => {
      // JSDOM default is http://localhost
      expect(isInternalUrl('http://localhost/test')).toBe(true);
    });

    it('rejects URLs from different origins', () => {
      expect(isInternalUrl('https://google.com', ORIGIN)).toBe(false);
    });

    it('handles SSR fallback (no window/location) correctly', () => {
      const originalLocation = global.location;
      // @ts-expect-error  Testing runtime fallback for non-existent property
      delete global.location;

      expect(isInternalUrl('/relative')).toBe(true);
      expect(isInternalUrl('https://axiom.dev')).toBe(false);

      global.location = originalLocation;
    });

    it('rejects protocol-relative URLs pointing elsewhere', () => {
      // //google.com is an absolute URL in many contexts
      expect(isInternalUrl('//google.com', ORIGIN)).toBe(false);
    });
  });
});
