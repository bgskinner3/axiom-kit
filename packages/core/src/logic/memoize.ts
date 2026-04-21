export const memoize = <T>(fn: (arg: string) => T) => {
  const cache: Record<string, T> = Object.create(null);

  return (arg: string): T => {
    if (arg in cache) {
      return cache[arg]; // Return the "remembered" result
    }
    const result = fn(arg); // Run the actual logic
    cache[arg] = result; // Save it for next time
    return result;
  };
};

// export const memoizeRegex = <T extends RegExp>(fn: (pattern: string) => T) => {
//   // Use a Map instead of an Object for better performance with frequent writes
//   const cache = new Map<string, T>();

//   return (pattern: string): T => {
//     // 1. Check Cache
//     const cached = cache.get(pattern);
//     if (cached) return cached;

//     // 2. Run Logic
//     const result = fn(pattern);

//     // 3. Prevent Memory Leaks
//     // If the cache gets too big (e.g., 1000+ custom user regexes),
//     // you might want to clear it or use a Least Recently Used (LRU) strategy.
//     if (cache.size > 1000) cache.clear();

//     cache.set(pattern, result);
//     return result;
//   };
// };
