export {};

declare global {
  /**
   * We define a named property on globalThis.
   * This is the only way to get 100% type safety with global symbols
   * without using 'as any' in the implementation.
   */
  var __REGEX_ENGINE_REGISTRY__: Map<string, string>;
}
