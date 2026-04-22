import { REGEX_PRE_REGISTRY } from '../models';
import type { TBranded } from '../models';
import type { TRegexKey, TPreRegistry } from '../models';
import { regexStore } from './regex-lru';
export interface RegexEngine extends TPreRegistry {}
export class RegexEngine {
  private readonly REGISTRY_KEY = '__REGEX_ENGINE_REGISTRY__';

  constructor() {
    if (!globalThis[this.REGISTRY_KEY]) {
      globalThis[this.REGISTRY_KEY] = new Map<string, string>();
    }
    Object.defineProperties(this, REGEX_PRE_REGISTRY);
  }

  // private get _store(): Map<string, string> {
  //   return globalThis[this.REGISTRY_KEY];
  // }

  public is<K extends TRegexKey>(
    this: Record<TRegexKey, string>,
    key: K,
    val: string,
  ): val is TBranded<string, K> {
    return regexStore.get(this[key]).test(val);
  }
  // public capture<Shape extends Record<string, string>>(
  //   key: TRegexKey,
  //   val: string,
  // ): Shape | null {
  //   const re = (this as any)[key] as RegExp;
  //   const match = re.exec(val);
  //   return (match?.groups as Shape) ?? null;
  // }

  // /**
  //  * 🧼 The Purifier (clean)
  //  * Replaces matches with a string (default empty).
  //  */
  // public clean(key: TRegexKey, val: string, replaceWith = ''): string {
  //   const re = (this as any)[key] as RegExp;
  //   return val.replace(re, replaceWith);
  // }
}
