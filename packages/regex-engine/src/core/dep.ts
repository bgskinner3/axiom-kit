/**
   * Simple, fast, and narrows the type to a branded string.
   * 
   * 
   *   static guard<K extends RegexKey>(key: K, val: string): val is TBrand<string, K> {
    return REGEX_CONSTANTS[key].test(val);
  }


  Strips characters based on a key and maintains the "Clean" brand

  static sanitize(key: RegexKey, val: string): string {
    return val.replace(REGEX_CONSTANTS[key], '');
  }
   */

/**
   // 1. The Narrower (The Gatekeeper)
  static is<K extends RegexKey>(key: K, val: string): val is TBranded<string, K> {
    return REGEX_CONSTANTS[key].test(val);
  }

  // 2. The Extractor (The Data Linker)
  static capture<T extends Record<string, string>>(key: RegexKey, val: string): T | null {
    const match = REGEX_CONSTANTS[key].exec(val);
    return (match?.groups as T) ?? null;
  }

  // 3. The Transformer (The Purifier)
  static clean(key: RegexKey, val: string, replaceWith = ''): string {
    return val.replace(REGEX_CONSTANTS[key], replaceWith);
  }
 */

// REGISTER
// export class RegexBox<T extends Record<string, RegExp>> {
//   private registry: T;

//   constructor(customPatterns: T) {
//     this.registry = { ...REGEX_CONSTANTS, ...customPatterns };
//   }

//   /**
//    * 🛡️ The "Gatekeeper"
//    * Narrow a string to a brand based on a key in the registry.
//    */
//   is<K extends keyof T | keyof typeof REGEX_CONSTANTS>(
//     key: K,
//     val: string
//   ): boolean {
//     const re = (this.registry as any)[key] || (REGEX_CONSTANTS as any)[key];
//     return re.test(val);
//   }

//   /**
//    * 🔍 The "Safe Extractor"
//    * Pulls named groups into a typed object.
//    */
//   capture<Shape extends Record<string, string>>(
//     key: keyof T | keyof typeof REGEX_CONSTANTS,
//     val: string
//   ): Shape | null {
//     const re = (this.registry as any)[key] || (REGEX_CONSTANTS as any)[key];
//     const match = re.exec(val);
//     return (match?.groups as Shape) ?? null;
//   }
// }

/**
 guard 
 brand 
 assert
 
 */
