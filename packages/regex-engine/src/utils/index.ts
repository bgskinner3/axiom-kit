import type { TRegexRegistry } from '../models';
import { ObjectUtils } from '@axiom/core';
import type { TBranded } from '../models';
import { __brand } from '../models';


export function brandRegex<B>(regex: string): TBranded<string, B> {
  return Object.assign(regex, { [__brand]: undefined as unknown as B });
}

export function createRegexRegistry<T extends Record<string, string>>(
  source: T,
): TRegexRegistry<T> {
  // Return type is now a branded STRING
  type Entry = [keyof T, PropertyDescriptor & { get: () => TBranded<string, keyof T> }];

  const entries = ObjectUtils.keys(source).map((key): Entry => {
    const descriptor = {
      get: () => {
        const keyStr = String(key);
        const globalStore = globalThis.__REGEX_ENGINE_REGISTRY__;
        
        // 1. Get raw pattern
        const rawPattern = globalStore?.get(keyStr) || source[key];

        // 2. Brand the string pattern
        return brandRegex<typeof key>(rawPattern);
      },
      enumerable: true,
      configurable: false,
    };

    return [key, descriptor];
  });

  return ObjectUtils.fromEntries(entries);
}