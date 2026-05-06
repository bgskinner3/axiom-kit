export const UTIL_CONFIG_OPTIONS = {
  fileName: 'test.ts',
  // mineTransformation
  programLib: 'lib.esnext.d.ts',
  // reifyType
  solidType: 'type TSolid<K extends string, T> = T & { readonly __brand: K };',
} as const;
