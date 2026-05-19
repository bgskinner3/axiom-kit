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

// TODO: Wrap up rename, flatten and merge runtime functions
// TODO: REGISTER API WITH TRANFORMER BUILD FOR TYPE INJECTION
// --- OVERLOAD 1: THE SELECTIVE RETENTION LANE (pick) ---
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
  // Bound the inputs tightly using the dedicated TTransformContext discriminated union shape
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
    flatten: () => console.log([]),
  } satisfies TTransformStrategyEngine<K>;

  // Highly specific, completely rule-compliant lookup executor function
  const executeStrategy = <ModeToken extends TTransformXalorModes>(
    runContext: {
      readonly mode: ModeToken;
    } & TTransformXalorParamMap<K>[ModeToken],
  ): TTransformXalorResultMap<K>[ModeToken] => {
    return TRANSFORMATION_MODES[runContext.mode](injectedKey, runContext);
  };

  // TypeScript now perfectly validates that the mode property inside 'ctx'
  // explicitly guarantees the internal presence of its companion parameters.
  return executeStrategy(ctx);
}

/**
 rename
 flatten
 merge
 */
