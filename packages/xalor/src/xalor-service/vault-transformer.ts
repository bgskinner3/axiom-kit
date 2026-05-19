import type {
  TTransformPickAndOmit,
  TSanitizeSlicedObject,
  TTransformRecursionLoop,
  TTransformSanitize,
  ISolidRegistry,
  TTransformRename,
  TTransformPredicate,
  TRenameDependency,
  TTransformDependency,
  TMergeDependency,
  TPickOmitDependency,
  TTransformMerge,
} from '../models/types';
import { TRANSFORM_SHAPE_MAPPER } from '../mappers';
import { markAsSolid } from '../utils';
import { isObject, isNull, isSet } from '../../shared';
import type { TSolidShape } from '../../shared';

export class XalethorVaultTransformer {
  /**
   * 🚀 UNIVERSAL STRATEGY DISPATCHER
   *
   * ROLE:
   * Safely unwraps polymorphic shape union variants, ensuring that the
   * inner callback structures align identically with the master mapper contract.
   */
  private static dispatchPolymorphicShape<SK extends TSolidShape['kind']>(
    targetKind: SK,
    targetShape: Extract<TSolidShape, { kind: SK }>,
    targetValue: unknown,
    dependency: TTransformDependency, // ✔️ FIX: Aligned perfectly to your core union container type
    depth: number,
    seenObjectsMap: Map<unknown, unknown>,
    predicate: TTransformPredicate,
  ): unknown {
    const internalStrategyWorker = TRANSFORM_SHAPE_MAPPER[targetKind];

    // ✔️ FIX: Removed explicit generic override variables to match your non-generic contract rules
    const recurseCallback: TTransformRecursionLoop = (v, s, f, d) => {
      /* prettier-ignore */
      return this.sanitize({ val: v, currentShape: s, dependency: f, depth: d, seenObjectsMap, predicate });
    };

    /* prettier-ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return internalStrategyWorker(targetShape as any, targetValue, dependency, depth, recurseCallback);
  }

  /**
   * 🔪 INTERNAL OBJECT SLICING & MUTATION ENGINGE WORKER
   *
   * ROLE:
   * Dynamically forks key allocation algorithms by evaluating the explicit dependency.mode tag.
   */
  private static sliceObjectProperties({
    val,
    currentShape,
    dependency, // ✔️ FIX: Aligned perfectly to your core union container type
    depth,
    seenObjectsMap,
    predicate,
  }: TSanitizeSlicedObject): unknown {
    const proto = Object.getPrototypeOf(val || {});
    const cleanObj = Object.create(proto);
    seenObjectsMap.set(val, cleanObj);

    const props = currentShape.properties;
    const dataRef = val;

    // ========================================================================
    // 🎛️ FORK ROUTE 1 & 2: EVALUATES SELECTION PIPELINES ('pick' / 'omit')
    // ========================================================================
    if (dependency.mode === 'pick' || dependency.mode === 'omit') {
      const activeSet = dependency.set;

      if (predicate && isSet(activeSet)) {
        for (const key of Object.keys(props)) {
          const metadata = props[key];
          /* prettier-ignore */
          if (metadata && metadata.shape && Object.prototype.hasOwnProperty.call(val, key)) {
            if (predicate(key, activeSet) && isObject(dataRef)) {
              const rawSourceValue = (dataRef as Record<string, unknown>)[key];
              /* prettier-ignore */
              cleanObj[key] = this.sanitize({ val: rawSourceValue, currentShape: metadata.shape, dependency, depth: depth + 1, seenObjectsMap, predicate});
            }
          }
        }
        return cleanObj;
      }
    }

    // ========================================================================
    // 🎛️ FORK ROUTE 3: EVALUATES NOMINAL KEY TRANSLATIONS ('rename')
    // ========================================================================
    if (dependency.mode === 'rename') {
      const mappings = dependency.mappings;

      for (const blueprintKey of Object.keys(props)) {
        const metadata = props[blueprintKey];
        if (metadata && metadata.shape) {
          // 🔍 INVERSION KEY SNIFFER: Search the lookup dictionary backwards
          let rawIncomingSourceKey = blueprintKey;
          for (const [incomingKey, targetKey] of Object.entries(mappings)) {
            if (targetKey === blueprintKey) {
              rawIncomingSourceKey = incomingKey;
              break;
            }
          }

          if (
            isObject(dataRef) &&
            Object.prototype.hasOwnProperty.call(dataRef, rawIncomingSourceKey)
          ) {
            const rawSourceValue = (dataRef as Record<string, unknown>)[
              rawIncomingSourceKey
            ];
            /* prettier-ignore */
            cleanObj[blueprintKey] = this.sanitize({ val: rawSourceValue, currentShape: metadata.shape, dependency, depth: depth + 1, seenObjectsMap, predicate });
          }
        }
      }
      return cleanObj;
    }

    // ========================================================================
    // 🎛️ FORK ROUTE 4: EVALUATES ENTITY AGGREGATIONS ('merge')
    // ========================================================================
    // ✔️ CONNECTED NATIVELY: Deep-nested merging execution support activated!
    if (dependency.mode === 'merge') {
      const patchRef = (dependency.patchData as Record<string, unknown>) || {};
      const baseDataRef = (val as Record<string, unknown>) || {};

      for (const key of Object.keys(props)) {
        const metadata = props[key];
        if (metadata && metadata.shape) {
          const val1 = baseDataRef[key];
          const val2 = patchRef[key];

          const selectedTargetValue = val2 !== undefined ? val2 : val1;

          // Re-wrap the nested child patch segment into a localized sub-dependency container record
          const childDependency: TMergeDependency = {
            mode: 'merge',
            patchData: val2,
          };

          /* prettier-ignore */
          cleanObj[key] = this.sanitize({ val: selectedTargetValue, currentShape: metadata.shape, dependency: childDependency, depth: depth + 1, seenObjectsMap, predicate });
        }
      }
      return cleanObj;
    }

    return cleanObj;
  }

  /**
   * 🧼 CORE RECURSIVE SANITIZER GATE
   */
  private static sanitize({
    val,
    currentShape,
    dependency, // ✔️ FIX: Aligned perfectly to your core union container type
    depth,
    seenObjectsMap,
    predicate,
  }: TTransformSanitize): unknown {
    if (depth > 25) return null;
    if (isNull(val) || !isObject(val)) return val;

    if (seenObjectsMap.has(val)) {
      return seenObjectsMap.get(val);
    }

    if (!currentShape) return val;

    const kind = currentShape.kind;

    /* prettier-ignore */
    if (kind === 'object') return this.sliceObjectProperties({ val, currentShape: currentShape, dependency, depth, seenObjectsMap, predicate });

    const activePredicate: TTransformPredicate = predicate ?? (() => true);
    /* prettier-ignore */
    return this.dispatchPolymorphicShape(kind, currentShape, val, dependency, depth, seenObjectsMap, activePredicate);
  }

  // ========================================================================
  // PUBLIC API SERVICE EDGE GATEWAY PORTS
  // ========================================================================

  /**
   * 📥 PUBLIC EXECUTOR: SELECTION PIPELINES ('pick' / 'omit')
   */
  public static transformPickAndOmit<K extends keyof ISolidRegistry>({
    data,
    shape,
    filterSet,
    predicate,
  }: TTransformPickAndOmit): ISolidRegistry[K] {
    const seenObjectsMap = new Map<unknown, unknown>();

    // ✔️ FIX: Wrap your variables into the strict container envelope before triggering recursion!
    const pickOmitEnvelope: TPickOmitDependency = {
      mode: predicate('test_probe', new Set()) ? 'pick' : 'omit',
      set: filterSet,
    };

    /* prettier-ignore */
    const rawResultObj = this.sanitize({ val: data, currentShape: shape, dependency: pickOmitEnvelope, depth: 0, seenObjectsMap, predicate: predicate as TTransformPredicate });

    if (markAsSolid<K, ISolidRegistry[K]>(rawResultObj)) {
      return rawResultObj;
    }
    throw new Error(
      `[xalor] Critical Failure: Failed to brand mutation output structure graph.`,
    );
  }

  /**
   * 🚀 PUBLIC EXECUTOR: NOMINAL KEY TRANSLATION ('rename')
   */
  public static transformRename<K extends keyof ISolidRegistry>({
    data,
    shape,
    mappings,
  }: TTransformRename): ISolidRegistry[K] {
    const seenObjectsMap = new Map<unknown, unknown>();

    // ✔️ FIX: Wrap your variables into the strict container envelope before triggering recursion!
    const renameEnvelope: TRenameDependency = {
      mode: 'rename',
      mappings,
    };

    /* prettier-ignore */
    const rawResultObj = this.sanitize({ val: data, currentShape: shape, dependency: renameEnvelope, depth: 0, seenObjectsMap });

    if (markAsSolid<K, ISolidRegistry[K]>(rawResultObj)) {
      return rawResultObj;
    }
    throw new Error(
      `[xalor] Critical Failure: Failed to brand rename mutation output structure graph.`,
    );
  }

  /**
   * 🧬 PUBLIC EXECUTOR: MULTI-ENTITY AGGREGATIONS ('merge')
   * ✔️ NEW CHANNELS ENTRY PORTS ACTIVATED!
   */
  public static transformMerge<K extends keyof ISolidRegistry>({
    dataOne,
    dataTwo,
    shape,
  }: TTransformMerge): ISolidRegistry[K] {
    const seenObjectsMap = new Map<unknown, unknown>();

    // ✔️ FIX: Wrap your variables into the strict container envelope before triggering recursion!
    const mergeEnvelope: TMergeDependency = {
      mode: 'merge',
      patchData: dataTwo,
    };

    /* prettier-ignore */
    const rawResultObj = this.sanitize({ val: dataOne, currentShape: shape, dependency: mergeEnvelope, depth: 0, seenObjectsMap });

    if (markAsSolid<K, ISolidRegistry[K]>(rawResultObj)) {
      return rawResultObj;
    }
    throw new Error(
      `[xalor] Critical Failure: Failed to brand merge mutation output structure graph.`,
    );
  }
}
