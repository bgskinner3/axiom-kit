import type { TVaultSyncPayload, TTypeGuard, TAssert } from './shared';
import type { ISolidRegistry } from './definitions';
/**
 * TPERSIST_PARAMS
 *
 * ROLE:
 * Execution contract for the Banker Engine's cache synchronization pass.
 * Coordinates system root paths with active memory maps during write loops.
 *
 * @see XalethorVaultArchive.persist
 */
export type TPersistParams = {
  rootDir: string;
  registry: Map<string, TVaultSyncPayload>;
};
/**
 * TGET_CALLER_LOCATION_OPTIONS
 *
 * ROLE:
 * Configuration matrix for the Spatial Identity geometry crawler.
 * Tunes V8 stack trace extraction settings to generate precision source code links.
 *
 * @see getCallerLocation
 * @param fallbackIndex: Fallback index if preferredIndex is not available (default: 2)
 * @param topParent: Whether to get the top-level parent function instead of preferredIndex (default: false)
 * @param stripPathPrefix: Path prefix to strip from the returned line (default: process.cwd())
 */
export type TGetCallerLocationOptions = {
  preferredIndex?: number;
  fallbackIndex?: number;
  topParent?: boolean;
  stripPathPrefix?: string;
};
/**
 * T_RETURN_VALIDATION_TOOLS
 *
 * ROLE:
 * The public interface payload mapping signature for Category 2 (Validation API).
 * Packages narrowed boolean guards and terminal exception asserters together.
 */
export type TReturnValidationTools<K extends keyof ISolidRegistry> = {
  guard: TTypeGuard<ISolidRegistry[K]>;
  assert: TAssert<ISolidRegistry[K]>;
};
