import { XalethorService } from '../xalor-service';
import type {
  ISolidRegistry,
  TTransformXalorParamMap,
  TTransformStrategyEngine,
  TTransformContext,
  TFlattenDataContext,
  TMergeContext,
  TRenameContext,
  TPickOmitContext,
  TTransformXalorResultMap,
} from '../models/types';
import type { TTransformXalorModes } from '../../shared';

/**
 * @name TRANSFORMER RUNTIME API
 * @description
 * Standardized polymorphic runtime portal executing Category 3 (The Evolution Pillar Layer) operations.
 * Traverses deep complex graph layouts to selectively slice, names-remap, or aggregate structural elements.
 *
 * DESIGN INVARIANTS:
 * - Satisfies Commandment IV (Operation Isolation) and Commandment VIII (Internal Efficiency).
 * - Implements a rigid static dispatch switchboard object layout to bypass procedural loop nesting structures.
 * - Operates with absolute 100% type safety: zero un-tracked 'any' variable fallback entries allowed.
 * - Build-time generic parameters <"KEY", "mode"> are stripped and injected at indices 2 and 3 at compilation runtime.
 *
 * -------
 * @mode pick
 * @description
 * Selective field extraction retention pass. Sweeps through the master object blueprint properties schema,
 * matching against an O(1) filter Set cache to retain explicit tracking keys while dropping everything else.
 * @example
 * ```ts
 * const slicedUser = transformXalor<'User', 'pick'>({
 *   mode: 'pick',
 *   data: rawPayload,
 *   keys: ['id', 'username', 'email']
 * });
 * ```
 * -------
 * @mode omit
 * @description
 * Structural property exclusion pruning pass. Operates symmetrically to pick, but implements a inverted
 * lookup guard to discard explicit targeted properties fields while maintaining un-listed graph layers intact.
 * @example
 * ```ts
 * const safeUserRecord = transformXalor<'User', 'omit'>({
 *   mode: 'omit',
 *   data: rawPayload,
 *   keys: ['passwordHash', 'saltToken']
 * });
 * ```
 * -------
 * @mode rename
 * @description
 * Nominal property alignment and structural remapping. Back-checks an incoming dictionary using an O(1) inversion
 * key sniffer to translate alternate external key names directly into your master internal blueprint schema coordinates.
 * @example
 * ```ts
 * const alignedUser = transformXalor<'User', 'rename'>({
 *   mode: 'rename',
 *   data: rawThirdPartyJson,
 *   mappings: { ext_user_id: 'id', user_mail: 'email' }
 * });
 * ```
 * -------
 * @mode merge
 * @description
 * Symmetrical deep twin-entity data aggregation. Recursively tracks matching array indices and object structural paths,
 * prioritizing fields inside the secondary patch payload variable while safely falling back to baseline properties.
 * @example
 * ```ts
 * const consolidatedProfile = transformXalor<'User', 'merge'>({
 *   mode: 'merge',
 *   dataOne: currentDatabaseState,
 *   dataTwo: incomingDeltaPatch
 * });
 * ```
 * -------
 * @mode flatten
 * @description
 * Asymmetric linear matrix decompression. Steps through deep nested object chains and indexed collections, compiling
 * paths into an optimized, single-layer dot-notation analytical dictionary canvas map.
 * @example
 * ```ts
 * const flatAnalyticsMap = transformXalor<'User', 'flatten'>({
 *   mode: 'flatten',
 *   data: complexUserGraph
 * });
 * // Result: Record<string, string | number | boolean> -> { "profile.address.zip": "10001" }
 * ```
 * -------
 * @see TTransformStrategyEngine
 * @see XalethorVaultTransformer
 */
// --- OVERLOAD 1: THE STRUCTURAL SELECTION LANE (pick) ---
export function transformXalor<
  K extends keyof ISolidRegistry,
  _M extends 'pick',
>(ctx: TPickOmitContext<K>): ISolidRegistry[K];
// --- OVERLOAD 2: THE STRUCTURAL EXCLUSION LANE (omit) ---
export function transformXalor<
  K extends keyof ISolidRegistry,
  _M extends 'omit',
>(ctx: TPickOmitContext<K>): ISolidRegistry[K];
// --- OVERLOAD 3: THE NOMINAL ALIGNMENT LANE (rename) ---
export function transformXalor<
  K extends keyof ISolidRegistry,
  _M extends 'rename',
>(ctx: TRenameContext): ISolidRegistry[K];
// --- OVERLOAD 4: THE ENTITY AGGREGATION LANE (merge) ---
export function transformXalor<
  K extends keyof ISolidRegistry,
  _M extends 'merge',
>(ctx: TMergeContext): ISolidRegistry[K];
// --- OVERLOAD 5: THE MATRIX DECOMPRESSION LANE (flatten) ---
export function transformXalor<
  _K extends keyof ISolidRegistry,
  _M extends 'flatten',
>(ctx: TFlattenDataContext): Record<string, string | number | boolean>;

// --- IMPLEMENTATION ---
export function transformXalor<
  K extends keyof ISolidRegistry,
  M extends TTransformXalorModes,
>(
  ctx: TTransformContext<K, M>,
  injectedKey?: K,
  injectedMode?: M,
): ISolidRegistry[K] | Record<string, string | number | boolean> | void {
  if (!injectedKey || !injectedMode || !ctx) {
    throw new Error(
      `[xalor] 🚨 GATEWAY BLOCK: 'transformXalor' executed without compiled metadata properties.\n` +
        `Ensure your build-time transformer plugin is active.`,
    );
  }
  const activeShape = XalethorService.blueprintVault(injectedKey);
  if (!activeShape) {
    throw new Error(
      `[xalor] 🚨 Transformation failed: Blueprint missing from Vault for key: ${injectedKey}`,
    );
  }
  const TRANSFORMATION_MODES: TTransformStrategyEngine<K> = {
    pick: (_key, context) => {
      const { keys, data } = context;
      const stringKeysCollection = keys.map(String);
      const activeFilterSet = new Set<string>(stringKeysCollection);
      /* prettier-ignore */ return XalethorService.executePickSanitizer(data, activeShape, activeFilterSet);
    },
    omit: (_key, context) => {
      const { keys, data } = context;
      const stringKeysCollection = keys.map(String);
      const activeFilterSet = new Set<string>(stringKeysCollection);
      /* prettier-ignore */ return XalethorService.executeOmitSanitizer(data, activeShape, activeFilterSet);
    },
    rename: (_key, context) => {
      const { data, mappings } = context;
      /* prettier-ignore */ return XalethorService.executeRenameSanitizer(data, activeShape, mappings);
    },
    merge: (_key, context) => {
      const { dataOne, dataTwo } = context;
      /* prettier-ignore */ return XalethorService.executeMergeSanitizer(dataOne, dataTwo, activeShape);
    },
    flatten: (_key, context) => {
      const { data } = context;
      /* prettier-ignore */ return XalethorService.executeFlattenSanitizer(data, activeShape);
    },
  } satisfies TTransformStrategyEngine<K>;

  const executeStrategy = <ModeToken extends TTransformXalorModes>(
    runContext: {
      readonly mode: ModeToken;
    } & TTransformXalorParamMap<K>[ModeToken],
  ): TTransformXalorResultMap<K>[ModeToken] => {
    return TRANSFORMATION_MODES[runContext.mode](injectedKey, runContext);
  };

  return executeStrategy(ctx);
}
