

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
