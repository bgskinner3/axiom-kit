import { XalethorService } from '../xalor-service';
import type {
  ISolidRegistry,
  TGenerateXalorReturn,
  TGenerateXalorStrategyEngine,
} from '../models/types';
import type { TSolidBranded, TGenerateXalorModes } from '../../shared';

/**
 * @name GENERATE RUNTIME API
 * @description
 * Standardized polymorphic runtime gateway executing Category 1 (The Generation Pillar Layer) operations.
 * Seeds, physically scrubs, or structurally coaxes baseline schemas out of precompiled Vault registry blueprints.
 *
 * DESIGN INVARIANTS:
 * - Satisfies Commandment IV (Operation Isolation) and Commandment VIII (Internal Efficiency).
 * - Coordinates structural seed cloning, mock data synthesis, and deep primitive shape casting.
 * - Build-time generic parameters <"KEY", "mode"> are stripped and injected at indices 1 and 2 at compilation runtime.
 *
 * -------
 * @mode default
 * @description
 * Zero-state blueprint instantiation. Materializes a pristine object model matching your target contract
 * with guaranteed schema-valid default leaf values, satisfying initial entity baseline setups cleanly.
 * @example
 * ```ts
 * const emptyUser = generateXalor<'User', 'default'>();
 * // Returns a valid user object initialized with default string/number structures
 * console.log(emptyUser.username); // ""
 * ```
 * -------
 * @mode mock
 * @description
 * Constraint-aware stochastic data simulation. Iterates across your shape graph configurations to dynamically
 * manufacture realistic, property-compliant mock values, fully optimized for unit testing matrices.
 * @example
 * ```ts
 * const randomUser = generateXalor<'User', 'mock'>();
 * // Returns a randomly seeded, structurally valid user object instance
 * console.log(randomUser.email); // "f7x9a@example.com"
 * ```
 * -------
 * @mode clone
 * @description
 * Deep property-scrubbing structural wash. Loops down through an untrusted input payload, copy-instantiating
 * class prototypes while stripping away un-declared rogue properties to preserve strict runtime data memory integrity.
 * @example
 * ```ts
 * const cleanUser = generateXalor<'User', 'clone'>(dirtyIncomingRequestJson);
 * // Returns a completely stripped clone carrying zero extra properties beyond the 'User' blueprint
 * console.log(cleanUser.id);
 * ```
 * -------
 * @mode cast
 * @description
 * Type coercion data shaping pipeline. Symmetrically coerces, un-boxes, or parses loose incoming runtime properties
 * into the strict primitive type layouts explicitly demanded by the blueprint schema, matching data layers safely.
 * @example
 * ```ts
 * const correctUser = generateXalor<'User', 'cast'>({
 *   id: 12345, // Number coerced safely to String if the blueprint demands a string key token
 *   isActive: "true" // String coerced safely to Boolean
 * });
 * ```
 * -------
 * @see TGenerateXalorStrategyEngine
 * @see XalethorVaultGenerator
 */

// --- OVERLOAD 1: THE DEFAULT ---
export function generateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'default',
>(): TSolidBranded<K, ISolidRegistry[K]>;
// --- OVERLOAD 2: THE MOCK ---
export function generateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'mock',
>(): TSolidBranded<K, ISolidRegistry[K]>;
// --- OVERLOAD 3: THE CLONE ---
export function generateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'clone',
>(data: unknown): TSolidBranded<K, ISolidRegistry[K]>;
// --- OVERLOAD 5: THE CAST ---
export function generateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'cast',
>(data: unknown): TSolidBranded<K, ISolidRegistry[K]>;
// --- IMPLEMENTATION ---
export function generateXalor<
  K extends keyof ISolidRegistry,
  M extends TGenerateXalorModes,
>(key?: K, mode?: M, data?: unknown): TGenerateXalorReturn<K, M> {
  if (!key || !mode) {
    throw new Error(
      `[xalor] 🚨 GATEWAY BLOCK: 'generateXalor' executed without compiled metadata properties.\n` +
        `Ensure your build-time transformer plugin is active.`,
    );
  }
  const GENERATOR_MODES: TGenerateXalorStrategyEngine<K> = {
    default: (k) => XalethorService.produceDefault(k),

    mock: (k) => XalethorService.produceMock(k),

    clone: (k, d) => XalethorService.produceClone(d, k),

    cast: (k, d) => XalethorService.produceCast(d, k),
  } satisfies TGenerateXalorStrategyEngine<K>;

  return GENERATOR_MODES[mode](key, data);
}
