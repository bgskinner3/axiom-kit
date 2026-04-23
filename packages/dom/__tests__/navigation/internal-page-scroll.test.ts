/**
 * @jest-environment jsdom
 */
import { handleInternalHashScroll } from '../../src';

describe('handleInternalHashScroll', () => {
  // 1. Setup global mocks
  const scrollToMock = jest.fn();
  const scrollIntoViewMock = jest.fn();
  const preventDefaultMock = jest.fn();

  beforeAll(() => {
    window.scrollTo = scrollToMock;
    // JSDOM doesn't implement scrollIntoView, so we add it to the prototype
    Element.prototype.scrollIntoView = scrollIntoViewMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = ''; // Reset DOM
  });

  it('returns false for external or non-hash links', () => {
    const result = handleInternalHashScroll({ href: 'https://google.com' });
    expect(result).toBe(false);
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it('scolls to top for # or #top and prevents default', () => {
    const event = { preventDefault: preventDefaultMock } as any;

    const result = handleInternalHashScroll({
      event,
      href: '#top',
      behavior: 'smooth',
    });

    expect(result).toBe(true);
    expect(preventDefaultMock).toHaveBeenCalled();
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrolls to an element by ID and prevents default', () => {
    // Setup target element
    document.body.innerHTML = '<div id="target-section">Content</div>';
    const event = { preventDefault: preventDefaultMock } as any;

    const result = handleInternalHashScroll({ event, href: '#target-section' });

    expect(result).toBe(true);
    expect(preventDefaultMock).toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('falls back to scrollTo if scrollIntoView throws (Legacy/Buggy Browsers)', () => {
    document.body.innerHTML = '<div id="legacy-target"></div>';

    // Simulate scrollIntoView failing (like older iOS Safari versions)
    scrollIntoViewMock.mockImplementationOnce(() => {
      throw new Error('Not supported');
    });

    const result = handleInternalHashScroll({ href: '#legacy-target' });

    expect(result).toBe(true);
    // Should have called scrollTo as the fallback
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('returns false if the element ID does not exist in the document', () => {
    const result = handleInternalHashScroll({ href: '#missing-id' });
    expect(result).toBe(false);
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
