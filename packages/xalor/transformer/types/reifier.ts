import type { Type, TypeChecker } from 'typescript';
import type { TSolidShape } from '../../src/models/types/shared';
/**
 * REIFIER CONTEXT
 * Encapsulates the necessary tools and state required during the
 * "Mining" phase of the transformation process.
 */
export type TReifierContext = {
  checker: import('typescript').TypeChecker;
  seen: Set<Type>;
};
/**
 * THE REIFIER SIGNATURE (TReifier)
 *
 * A pluggable middleware function used by the Transformer to analyze TS types.
 * The modular registry architecture allows new Reifiers to be added for custom
 * logic (e.g., specific branding, class handling, or intersections).
 *
 * @param type - The raw TypeScript Type to be solidified.
 * @param checker - The current Program's TypeChecker for deep symbol analysis.
 * @param next - A recursive callback to trigger the next reification in the chain.
 * @param seen - A recursion-tracking Set to prevent infinite loops on circular types.
 */
export type TReifier = (
  type: Type,
  checker: TypeChecker,
  next: (type: Type) => TSolidShape, // Recursive hook
  seen: Set<Type>,
) => TSolidShape | undefined;
