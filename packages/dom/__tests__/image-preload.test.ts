/**
 * @jest-environment jsdom
 */
import { preloadImages } from '../src';

describe('preloadImages', () => {
  let imageInstances: HTMLImageElement[] = [];
  const originalImage = global.Image;

  beforeEach(() => {
    imageInstances = [];
    jest.clearAllMocks();

    // 🚀 Mock global Image constructor
    global.Image = class extends originalImage {
      constructor() {
        super();
        imageInstances.push(this as unknown as HTMLImageElement);

        // Simulate async behavior for .decode()
        this.decode = jest.fn(() => Promise.resolve());

        // Simulate immediate success for .src assignment in some cases
        Object.defineProperty(this, 'src', {
          set(v) {
            this._src = v;
            // In a real test, we manually trigger onload to control timing
          },
          get() {
            return this._src;
          },
        });
      }
    } as any;
  });

  afterAll(() => {
    global.Image = originalImage;
  });

  it('resolves immediately for an empty input', async () => {
    await expect(preloadImages([])).resolves.toBeUndefined();
  });

  it('uses .decode() for modern browsers', async () => {
    const url = 'https://axiom.dev';

    const promise = preloadImages(url);

    // Manually resolve the first image found
    const img = imageInstances[0];
    expect(img.decode).toHaveBeenCalled();

    await promise;
  });

  it('respects the concurrency limit', async () => {
    const urls = ['1.png', '2.png', '3.png', '4.png'];
    const concurrency = 2;

    // Start preloading
    const promise = preloadImages(urls, { concurrency });

    // Only 2 images should be initialized initially
    expect(imageInstances.length).toBe(2);

    // Manually finish the first two
    await Promise.resolve(); // Let workers pull from generator

    // Once those finish, the workers pull the next 2
    await promise;
    expect(imageInstances.length).toBe(4);
  });

  it('fails silently if an image 404s (Resilience)', async () => {
    const urls = ['valid.png', 'broken.png'];

    // Mock decode to fail for the broken one
    global.Image = class extends originalImage {
      constructor() {
        super();
        imageInstances.push(this as any);
        this.decode = () => {
          if (this.src.includes('broken'))
            return Promise.reject(new Error('404'));
          return Promise.resolve();
        };
      }
    } as any;

    // This should NOT throw, allowing the batch to complete
    await expect(preloadImages(urls)).resolves.toBeUndefined();
  });

  it('skips URLs that are already in the internal cache', async () => {
    const url = 'https://axiom.dev';

    // First load
    await preloadImages(url);
    const countAfterFirst = imageInstances.length;

    // Second load of same URL
    await preloadImages(url);

    expect(imageInstances.length).toBe(countAfterFirst); // Should not increase
  });
});
