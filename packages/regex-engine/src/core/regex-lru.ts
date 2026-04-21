class RegexLRU {
  private cache = new Map<string, RegExp>();
  private readonly max: number;

  constructor(maxSize: number = 1000) {
    this.max = maxSize;
  }

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
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, regex);
    return regex;
  }
}
export const regexStore = new RegexLRU();
/**
 Since you are memoizing the instance, remember that regex.test() or regex.exec() on a global (/g) regex will update the lastIndex.
The Fix: You should advise users to either:
Reset manually: regex.lastIndex = 0 before use.
Use stateless methods: Like String.prototype.matchAll which handles the index internally.
 */
