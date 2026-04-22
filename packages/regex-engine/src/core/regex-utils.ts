// import type { TBranded } from '../models';
// import type {TRegexKey} from '../models'
// class RegexUtils {
//   public is<K extends TRegexKey>(
//     key: K,
//     val: string,
//   ): val is TBranded<string, K> {
//     return globalThis[key].test(val);
//   }
//   public assert<K extends keyof typeof REGEX_PRE_REGISTRY>(
//     key: K,
//     val: string,
//   ): TBranded<string, K> {
//     if (this.is(key, val)) return val;
//     throw new Error(`Validation failed for pattern: ${String(key)}`);
//   }
// }
