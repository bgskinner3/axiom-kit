import type { TRegexRegistry } from '../models';
import { ObjectUtils } from '@bgskinner2/axiom-kit-core';
import type { TBranded, TBrandEntry } from '../models';
import { __brand } from '../models';
class RegexRegistry {
  private cache = new Map<string, RegExp>();
  private readonly max: number;

  constructor(maxSize: number = 1000) {
    this.max = maxSize;
    // Initialize the global store if it doesn't exist
    if (!globalThis.__REGEX_ENGINE_REGISTRY__) {
      globalThis.__REGEX_ENGINE_REGISTRY__ = new Map<string, string>();
    }
  }

  /**
   * Returns a compiled RegExp from cache or creates a new one.
   */
  public get(pattern: string, flags?: string): RegExp {
    const key = flags ? `${pattern}|${flags}` : pattern;
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, existing);
      return existing;
    }
    const regex = new RegExp(pattern, flags);
    if (this.cache.size >= this.max) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, regex);
    return regex;
  }

  /**
   * Helper to attach the unique brand to a string.
   */
  public brandRegex<B>(regex: string): TBranded<string, B> {
    return Object.assign(regex, { [__brand]: undefined as unknown as B });
  }

  /**
   * Generates descriptors for an entire source object.
   */
  public createDescriptors<T extends Record<string, string>>(
    source: T,
  ): TRegexRegistry<T> {
    const entries = ObjectUtils.keys(source).map((key): TBrandEntry<T> => {
      const keyStr = String(key);

      // Seed global store
      if (!globalThis.__REGEX_ENGINE_REGISTRY__.has(keyStr)) {
        globalThis.__REGEX_ENGINE_REGISTRY__.set(keyStr, source[key]);
      }

      // Call our fixed helper
      return this.createDescriptor<T, keyof T>(key);
    });

    return ObjectUtils.fromEntries(entries);
  }

  /**
   * Generates a single descriptor for a key.
   */
  public createDescriptor<T, K extends keyof T>(key: K): TBrandEntry<T> {
    const descriptor = {
      get: (): TBranded<string, K> => {
        const keyStr = String(key);
        const rawPattern = globalThis.__REGEX_ENGINE_REGISTRY__.get(keyStr)!;
        return this.brandRegex<K>(rawPattern);
      },
      enumerable: true,
      configurable: true,
    };

    return [key, descriptor];
  }
}

export const regexStore = new RegexRegistry();
/**
 Since you are memoizing the instance, remember that regex.test() or regex.exec() on a global (/g) regex will update the lastIndex.
The Fix: You should advise users to either:
Reset manually: regex.lastIndex = 0 before use.
Use stateless methods: Like String.prototype.matchAll which handles the index internally.
 */

// class RegexRegistry {
//   private cache = new Map<string, RegExp>();
//   private readonly max: number;

//   constructor(maxSize: number = 1000) {
//     this.max = maxSize;
//   }

//   public get(pattern: string, flags?: string): RegExp {
//     const key = flags ? `${pattern}|${flags}` : pattern;

//     if (this.cache.has(key)) {
//       const existing = this.cache.get(key)!;

//       this.cache.delete(key);
//       this.cache.set(key, existing);

//       return existing;
//     }

//     const regex = new RegExp(pattern, flags);

//     if (this.cache.size >= this.max) {
//       const oldestKey = this.cache.keys().next().value;
//       if (oldestKey !== undefined) {
//         this.cache.delete(oldestKey);
//       }
//     }

//     this.cache.set(key, regex);
//     return regex;
//   }

//   public brandRegex<B>(regex: string): TBranded<string, B> {
//     return Object.assign(regex, { [__brand]: undefined as unknown as B });
//   }

//   public createRegexRegistry<T extends Record<string, string>>(
//     source: T,
//   ): TRegexRegistry<T> {
//     // Return type is now a branded STRING
//     // type TBrandEntry = [keyof T, PropertyDescriptor & { get: () => TBranded<string, keyof T> }];

//     const entries = ObjectUtils.keys(source).map((key): TBrandEntry<T> => {
//       const descriptor = {
//         get: () => {
//           const keyStr = String(key);
//           const globalStore = globalThis.__REGEX_ENGINE_REGISTRY__;

//           const rawPattern = globalStore?.get(keyStr) || source[key];

//           return this.brandRegex<typeof key>(rawPattern);
//         },
//         enumerable: true,
//         configurable: false,
//       };

//       return [key, descriptor];
//     });

//     return ObjectUtils.fromEntries(entries);
//   }
// }
