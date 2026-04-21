import type { TRegexRegistry } from '../models';
import { ObjectUtils } from '@axiom/core';
import { regexStore } from '../core/regex-lru';

export function createRegexRegistry<T extends Record<string, string>>(
  source: T,
): TRegexRegistry<T> {
  type Entry = [keyof T, PropertyDescriptor & { get: () => RegExp }];

  const entries = ObjectUtils.keys(source).map((key): Entry => {
    const descriptor = {
      get: () => {
        const keyStr = String(key);
        const globalStore = globalThis.__REGEX_ENGINE_REGISTRY__;

        // 1. Get the pattern string (Priority: Global Store > Hardcoded Source)
        const pattern = globalStore?.get(keyStr) || source[key];

        // 2. PLUG IN THE LRU HERE
        // Instead of 'new RegExp(pattern)', we let the store handle it.
        return regexStore.get(pattern);
      },
      enumerable: true,
      configurable: false,
    };

    return [key, descriptor];
  });

  return ObjectUtils.fromEntries(entries);
}
