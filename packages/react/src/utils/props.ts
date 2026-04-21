/**
 * @utilType util
 * @name extractDOMProps
 * @category React
 * @description Strips custom component props to return only valid HTML attributes for a specific element.
 * @link #extractdomprops
 *
 * ## 🧹 extractDOMProps — Safe Attribute Filtering
 *
 * Automatically extracts valid DOM props from a combined props object.
 * Prevents React "unknown prop" warnings by filtering against a whitelist.
 */
export function extractDOMProps<
  TElement extends ElementType,
  TFullProps extends ComponentPropsWithoutRef<TElement>,
>(props: TFullProps): ComponentPropsWithoutRef<TElement> {
  const entries = ObjectUtils.entries(props);
  // 2. No cast needed: ArrayUtils.filter narrows based on the isDOMEntry predicate
  const filteredEntries = ArrayUtils.filter(entries, isDOMEntry<TElement>);
  // 3. No cast needed: ObjectUtils.fromEntries consumes the narrowed entries

  return ObjectUtils.fromEntries(
    filteredEntries,
  ) as ComponentPropsWithoutRef<TElement>;
}
/**
 * Extracts a subset of properties from an object based on a whitelist of keys.
 *
 * This is useful for separating component-specific props from generic HTML
 * or system props, especially in design systems or polymorphic components.
 *
 * Example use cases:
 * - separating layout props from DOM props
 * - isolating design-system variants
 * - filtering props before spreading into native elements
 *
 * @example
 * ```ts
 * // 1. Define your custom keys (use 'as const' for best type inference)
 * const CODE_BLOCK_KEYS = ['language', 'showLineNumbers', 'rawCode'] as const;
 *
 * // 2. Extract only those props into a bundled object
 * const codeBlockProps = extractComponentProps(props, CODE_BLOCK_KEYS);
 *
 * // 3. Pass the bundle directly to your child component
 * return <CodeBlock {...codeBlockProps} />;
 * ```
 *
 * @returns A new object containing only the specified keys
 */
// export function extractComponentProps<
//   T extends Record<string, unknown>,
//   K extends keyof T & string, // Constrain K to strings for fromEntries compatibility
// >(props: T, keys: readonly K[]): Partial<Record<K, T[K]>> {
//   const isTargetKey = isKeyOfArray(keys);

//   const entries = ObjectUtils.entries(props);

//   const filteredEntries = entries.filter((entry): entry is [K, T[K]] =>
//     isTargetKey(entry[0]),
//   );

//   return ObjectUtils.fromEntries<K, T[K]>(filteredEntries)
// }
export function extractComponentProps<
  T extends Record<string, unknown>,
  K extends keyof T,
>(props: T, keys: readonly K[]): Pick<T, K> {
  const isTargetKey = isKeyOfArray(keys);

  const entries = ObjectUtils.entries(props);

  const filteredEntries = entries.filter((entry): entry is [K, T[K]] =>
    isTargetKey(entry[0]),
  );

  // Using unknown as a bridge tells TS to trust that the
  // filtered entries exactly match the specific Pick shape.
  return ObjectUtils.fromEntries(filteredEntries) as Pick<T, K>;
}
/**
 * @utilType util
 * @name lazyProxy
 * @category Processors React
 * @description Transparently caches the results of function properties upon first access.
 * @link #lazyproxy
 *
 * ## ⏱️ lazyProxy — On-Demand Property Evaluation
 *
 * Wraps an object in a Proxy to lazily evaluate function properties.
 * Results are cached, ensuring expensive computations only run once.
 *
 * - **Immutable**: Does not mutate the original object.
 * - **Performant**: Ideal for heavy config objects or unused properties.
 *
 * @param obj - The object containing functions to be lazily evaluated.
 * @returns A proxied version of the object with cached evaluation.
 */
export function lazyProxy<T extends Record<string, unknown>>(obj: T): T {
  const cache = new Map<keyof T, unknown>();
  const keys = new Set<keyof T>(ObjectUtils.keys(obj));

  return new Proxy(obj, {
    get(target, prop: keyof T | string | symbol, receiver: T) {
      if (!isString(prop) || !keys.has(prop as keyof T)) {
        return Reflect.get(target, prop, receiver);
      }
      // Return cached value if already resolved
      if (cache.has(prop as keyof T)) {
        return cache.get(prop as keyof T);
      }

      const value = target[prop as keyof T];

      if (isFunction(value)) {
        const result = value();
        cache.set(prop as keyof T, result);
        return result;
      }
      return value;
    },
  });
}