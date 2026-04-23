export const memoize = <T>(fn: (arg: string) => T) => {
  const cache = new Map<string, T>();

  return (arg: string): T => {
    const existing = cache.get(arg);
    if (existing !== undefined || cache.has(arg)) {
      return existing as T;
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};
