// models/types/transformer
import type { Type, TypeChecker } from 'typescript';
import { IS_SOLID_SHAPE_KINDS_CONFIG } from '../../constants';
/**
 * SHAPE KINDS
 * The exhaustive list of supported type categories in the Solid system.
 */
export type TSolidShapeKinds = keyof typeof IS_SOLID_SHAPE_KINDS_CONFIG;

export type TSolidObjectShape = {
  shape: TSolidShape;
  optional: boolean;
  name: string; // Helpful for Pillar 4 deterministic mocking
};

/**
 * BLUEPRINT (TSolidShape)
 *
 * A strict discriminated union representing the serialized "Solid" state of a TypeScript type.
 * This is the core data structure stored in the Ambient Type Database (The Vault).
 *
 * It allows the Runtime Engine to perform deep validation without access to
 * the original TypeScript source code or the Compiler API.
 */
export type TSolidShape =
  | /* prettier-ignore */ { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'bigint' | 'unknown'; }
  | /* prettier-ignore */ { kind: 'literal'; value: string | number | boolean }
  | /* prettier-ignore */ { kind: 'union'; values: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'intersection'; parts: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'branded'; name: string; base: TSolidShape }
  | /* prettier-ignore */ { kind: 'object'; properties: Record<string, TSolidObjectShape> }
  | /* prettier-ignore */ { kind: 'array'; items: TSolidShape }
  | /* prettier-ignore */ { kind: 'reference'; name: string };

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
