/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { REGEX_CENTRAL_PATTERN_SOURCE } from '../models';
import type { TBranded, TRegexRegistryInstance } from '../models';
import type { TRegexPatternKeys } from '../models';
import { regexStore } from './regex-registry';

export interface RegexEngine extends TRegexRegistryInstance {}
export class RegexEngine {
  private readonly REGISTRY_KEY = '__REGEX_ENGINE_REGISTRY__';
  constructor() {
    if (!globalThis[this.REGISTRY_KEY]) {
      globalThis[this.REGISTRY_KEY] = new Map<string, string>();
    }

    // 2. Localize the descriptor creation to this class
    // This avoids exporting a 'REGEX_PRE_REGISTRY' constant from models
    const descriptors = regexStore.createDescriptors(
      REGEX_CENTRAL_PATTERN_SOURCE,
    );

    // 3. Hydrate this instance
    Object.defineProperties(this, descriptors);
  }

  public register<K extends string>(key: K, pattern: string): void {
    // Update global map for persistence across the codebase
    const globalMap = globalThis[this.REGISTRY_KEY];
    globalMap.set(key, pattern);

    // Create and apply the branded descriptor to this instance
    const [propKey, descriptor] = regexStore.createDescriptor<any, K>(
      key as any,
    );
    Object.defineProperty(this, propKey, descriptor);
  }
  public is<K extends TRegexPatternKeys>(
    this: RegexEngine,
    key: K,
    val: string,
  ): val is TBranded<string, K> {
    const pattern: string = this[key];
    return regexStore.get(pattern).test(val);
  }

  public list(): string[] {
    return Array.from(globalThis[this.REGISTRY_KEY].keys());
  }
}
