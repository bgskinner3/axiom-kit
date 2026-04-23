export const memoize = <T>(fn: (arg: string) => T) => {
  const cache: Record<string, T> = Object.create(null);

  return (arg: string): T => {
    if (arg in cache) {
      return cache[arg];
    }
    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
};
