import {
  isPrimitiveShape,
  isObjectShape,
  isArrayShape,
  isUnionShape,
  isLiteralShape,
  isBrandedShape,
  isReferenceShape,
  isIntersectionShape,
  isObject,
  isArray,
  isUndefined,
} from '../guards';
import { validateShape, createInitialContext } from '../../validation';
import { IS_SOLID_CONFIG_ITEMS } from '../../models/constants';
import type { TSolidShape } from '../../models/types';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';

export function produceClone(
  data: unknown,
  shape: TSolidShape,
  seen = new Map<unknown, unknown>(),
  depth = 0,
): unknown {
  // ⚖️ THE DEPTH LAW (Security)
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) return null;

  // 1. Primitive check: Primitives are immutable, return as-is
  if (isPrimitiveShape(shape)) return data;

  // 2. Circular protection (Identity Law)
  const cached = seen.get(data);
  if (!isUndefined(cached)) return cached;

  // 3. OBJECT BRANCH (The Scrubbing Logic)
  if (isObjectShape(shape)) {
    if (!isObject(data)) return null;

    // Use your logic: Preserve the prototype if possible
    const proto = Object.getPrototypeOf(data);
    const cleanObj = Object.create(proto);
    seen.set(data, cleanObj);

    // 🎯 THE XALOR TWIST: We iterate the BLUEPRINT keys, not the DATA keys.
    // This physically excludes any keys not defined in TypeScript.
    const blueprintProps = shape.properties;
    for (const key in blueprintProps) {
      const metadata = blueprintProps[key];

      // We only copy the property if it physically exists in the input data
      if (Reflect.has(data, key)) {
        const sourceValue = data[key];
        cleanObj[key] = produceClone(
          sourceValue,
          metadata.shape,
          seen,
          depth + 1,
        );
      }
    }
    return cleanObj;
  }

  // 4. ARRAY BRANCH
  if (isArrayShape(shape)) {
    if (!isArray(data)) return [];

    const copy: unknown[] = [];
    seen.set(data, copy);

    // 🛡️ THE ARRAY BRAKE: Respect the physical laws of the Bunker
    // We cap the clone at 'maxItems' (e.g., 200) to prevent CPU hanging on malicious data.
    const limit = Math.min(
      data.length,
      IS_SOLID_CONFIG_ITEMS.reifyLimit.maxObjectProperties,
    );

    for (let i = 0; i < limit; i++) {
      copy[i] = produceClone(data[i], shape.items, seen, depth + 1);
    }

    return copy;
  }
  // 6. UNIONS (The Router)
  if (isUnionShape(shape)) {
    const matchingBranch = shape.values.find((branch) =>
      /**
       * 💎 FIX: We call the internal 'validateShape' engine function.
       * It accepts a raw TSolidShape object directly.
       * We pass a fresh context with NO key to ensure we don't
       * record "Union Sniffing" attempts in the global Auditor.
       */
      validateShape(data, branch, createInitialContext()),
    );

    return matchingBranch
      ? produceClone(data, matchingBranch, seen, depth)
      : null;
  }

  // 7. INTERSECTIONS (The Merger)
  if (isIntersectionShape(shape)) {
    /**
     * 💎 INTERSECTION LAW: We clone against every part and merge the results.
     * This ensures that if you have 'Base & Details', fields from both are kept.
     */
    let merged = {};
    for (const part of shape.parts) {
      const clonedPart = produceClone(data, part, seen, depth);
      if (isObject(clonedPart)) {
        merged = { ...merged, ...clonedPart };
      }
    }
    return merged;
  }

  // 8. BRANDED TYPES
  if (isBrandedShape(shape)) {
    // Branding is a nominal wrapper; we sanitize the underlying base.
    return produceClone(data, shape.base, seen, depth);
  }

  // 9. GRAPH JUMPS (Fragments)
  if (isReferenceShape(shape)) {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? produceClone(data, subShape, seen, depth) : data;
  }

  // 10. LITERALS
  if (isLiteralShape(shape)) {
    return data === shape.value ? data : null;
  }

  return data;
}
