import type { TMergeDependency, TMapperObject } from '../../models/types';
import { isObject, isNull, isArray } from '../../../shared';

/**
 * 🔪 STANDALONE OBJECT TRANSFORMATION WORKER
 *
 * ROLE:
 * Isolates and coordinates the complex conditional multi-fork property selection ('pick'/'omit'),
 * nominal alignment ('rename'), and entity aggregation ('merge') routines for object shape nodes.
 *
 */
export function transformerMapperObject({
  shape,
  data,
  dependency,
  depth,
  recurse,
}: TMapperObject) {
  /* prettier-ignore */ if (dependency.mode !== 'merge' && (!isObject(data) || isNull(data) || isArray(data)))
    return null;
  // DEFINE PARAMETERS
  const proto = Object.getPrototypeOf(data || {});
  const cleanObj = Object.create(proto);
  const blueprintProps = shape.properties;
  const dataRef = data || {};
  /**
   * ROUTE 1 & 2: MODES PICK || OMIT
   */
  if (dependency.mode === 'pick' || dependency.mode === 'omit') {
    const activeSet = dependency.set;
    const isAllowed =
      dependency.mode === 'pick'
        ? (k: string) => activeSet.has(k)
        : (k: string) => !activeSet.has(k);

    for (const key of Object.keys(blueprintProps)) {
      const propertyContainer = blueprintProps[key];
      if (
        propertyContainer?.shape &&
        Object.prototype.hasOwnProperty.call(dataRef, key)
      ) {
        if (isAllowed(key)) {
          /* prettier-ignore */ cleanObj[key] = recurse( dataRef[key], propertyContainer.shape, dependency, depth + 1,);
        }
      }
    }
    return cleanObj;
  }
  /**
   * ROUTE 3: MODE RENAME
   */
  if (dependency.mode === 'rename') {
    const mappings = dependency.mappings;
    for (const blueprintKey of Object.keys(blueprintProps)) {
      const propertyContainer = blueprintProps[blueprintKey];
      if (propertyContainer?.shape) {
        let rawIncomingSourceKey = blueprintKey;
        for (const [incomingKey, targetKey] of Object.entries(mappings)) {
          if (targetKey === blueprintKey) {
            rawIncomingSourceKey = incomingKey;
            break;
          }
        }
        /* prettier-ignore */ if (Object.prototype.hasOwnProperty.call(dataRef, rawIncomingSourceKey)) {
          /* prettier-ignore */ cleanObj[blueprintKey] = recurse(dataRef[rawIncomingSourceKey],propertyContainer.shape,dependency,depth + 1,);
        }
      }
    }
    return cleanObj;
  }
  /**
   * ROUTE 4: MODE merge
   */
  if (dependency.mode === 'merge') {
    const patchRef = dependency.patchData || {};

    for (const key of Object.keys(blueprintProps)) {
      const propertyContainer = blueprintProps[key];

      if (propertyContainer?.shape) {
        const val1 = dataRef[key];
        const val2 = patchRef[key];

        // Wrap the child patch layer into a localized dependency block to cascade down deep arrays/objects
        const nextChildDependency: TMergeDependency = {
          mode: 'merge',
          patchData: val2,
        };

        /* prettier-ignore */ cleanObj[key] = recurse( val1, propertyContainer.shape, nextChildDependency, depth + 1,);
      }
    }
    return cleanObj;
  }
  return cleanObj;
}
