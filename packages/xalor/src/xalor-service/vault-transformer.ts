import type {
  TTransformPickAndOmit,
  TSanitizeSlicedObject,
  TTransformRecursionLoop,
  TSanitizePickOmit,
  ISolidRegistry,
} from '../models/types';
import { TRANSFORMER_OMIT_PICK_MAPPER } from '../mappers';
import { markAsSolid } from '../utils';
import { isObject, isNull } from '../../shared';
import type { TSolidShape } from '../../shared';
export class XalethorVaultTransformer {
  // ========================================================================
  // ========================================================================
  // TRansForm Pick AND OMIT
  // ========================================================================
  // ========================================================================
  private static dispatchPolymorphicShape<SK extends TSolidShape['kind']>(
    targetKind: SK,
    targetShape: Extract<TSolidShape, { kind: SK }>,
    targetValue: unknown,
    set: Set<string>,
    depth: number,
    seenObjectsMap: Map<unknown, unknown>,
    predicate: (key: string, propertiesSet: Set<string>) => boolean,
  ): unknown {
    const internalStrategyWorker = TRANSFORMER_OMIT_PICK_MAPPER[targetKind];

    const recurseCallback: TTransformRecursionLoop = (v, s, f, d) =>
      /* prettier-ignore */
      this.sanitize({ val: v, currentShape: s, set: f, depth: d, seenObjectsMap, predicate });

    /* prettier-ignore */
    return internalStrategyWorker(targetShape, targetValue, set, depth, recurseCallback);
  }
  private static sliceObjectProperties({
    val,
    currentShape,
    set,
    depth,
    seenObjectsMap,
    predicate,
  }: TSanitizeSlicedObject): unknown {
    const proto = Object.getPrototypeOf(val);
    const cleanObj = Object.create(proto);
    seenObjectsMap.set(val, cleanObj);

    const props = currentShape.properties;
    const dataRef = val;

    for (const key of Object.keys(props)) {
      const metadata = props[key];

      /* prettier-ignore */ if (metadata && metadata.shape && Object.prototype.hasOwnProperty.call(val, key)) {
        if (predicate(key, set) && isObject(dataRef)) {
          const rawSourceValue = dataRef[key];
          
          /* prettier-ignore */ cleanObj[key] = this.sanitize({ val: rawSourceValue, currentShape: metadata.shape, set, depth: depth + 1, seenObjectsMap, predicate});
        }
      }
    }
    return cleanObj;
  }
  private static sanitize({
    val,
    currentShape,
    set,
    depth,
    seenObjectsMap,
    predicate,
  }: TSanitizePickOmit): unknown {
    // THE DEPTH LAW
    if (depth > 25) return null;
    if (isNull(val) || !isObject(val)) return val;
    // 🔄 RECURSION PROTECTION
    if (seenObjectsMap.has(val)) {
      return seenObjectsMap.get(val);
    }

    if (!currentShape) return val;
    const kind = currentShape.kind;

    /* prettier-ignore */ if (kind === 'object') return this.sliceObjectProperties({ val, currentShape, set, depth, seenObjectsMap, predicate,});

    /* prettier-ignore */ return this.dispatchPolymorphicShape(kind, currentShape, val, set, depth, seenObjectsMap, predicate);
  }
  public static transformPickAndOmit<K extends keyof ISolidRegistry>({
    data,
    shape,
    filterSet,
    predicate,
  }: TTransformPickAndOmit): ISolidRegistry[K] {
    const seenObjectsMap = new Map<unknown, unknown>();

    /* prettier-ignore */ const rawResultObj = this.sanitize({ val: data, currentShape: shape, set: filterSet, depth: 0, seenObjectsMap, predicate });
    if (markAsSolid<K, ISolidRegistry[K]>(rawResultObj)) {
      return rawResultObj;
    }

    throw new Error(
      `[xalor] Critical Failure: Failed to brand mutation output structure graph.`,
    );
  }
}
