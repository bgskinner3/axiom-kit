import {
  isPrimitiveShape,
  isObjectShape,
  isArrayShape,
  isUnionShape,
  isLiteralShape,
  isBrandedShape,
  isReferenceShape,
} from '../guards';
import { ObjectUtils } from '../object-utils';
import { PRIMITIVE_DEFAULTS } from '../../models/constants';
import type { TSolidShape } from '../../models/types';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';

/**
 * 🏗️ PRODUCE DEFAULT
 *
 * ROLE:
 * The "Materializer." Converts a static TSolidShape blueprint into a
 * physical, zero-value JavaScript object.
 *
 * STRATEGY:
 * - Recursive Materialization: Traverses the shape tree to build nested structures.
 * - Reference Resolution: Jumps across "Atomic Cut" fragments via the VaultKeeper.
 * - Law of Least Resistance: Defaults to the first branch of a Union.
 * - Structural Integrity: Omits optional fields to produce a minimal valid set.
 *
 * WHY:
 * Provides a "Standard Initial State" for any solidified type. Essential for
 * form initialization, state management, and the `XalethorVaultGenerator.cast` logic.
 *
 * @param {TSolidShape} shape - The structural DNA to materialize.
 * @returns {unknown} - A physical representation of the TypeScript interface.
 */
export function produceDefault(shape: TSolidShape): unknown {
  if (isPrimitiveShape(shape)) return PRIMITIVE_DEFAULTS[shape.type];
  if (isLiteralShape(shape)) return shape.value;

  if (isObjectShape(shape)) {
    const obj: Record<string, unknown> = {};
    const keys = ObjectUtils.keys(shape.properties);
    for (const key of keys) {
      const metadata = shape.properties[key];
      // Only generate if required; let optional fields stay undefined
      if (!metadata.optional) {
        obj[key] = produceDefault(metadata.shape);
      }
    }
    return obj;
  }

  if (isArrayShape(shape)) return [];

  // 🔗 THE MISSING LINK: Reference Resolution
  if (isReferenceShape(shape)) {
    // Jump to the Vault to get the shredded fragment
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? produceDefault(subShape) : undefined;
  }

  if (isUnionShape(shape)) {
    // Law of Least Resistance: Use the first valid branch
    return shape.values[0] ? produceDefault(shape.values[0]) : undefined;
  }

  if (isBrandedShape(shape)) return produceDefault(shape.base);

  return undefined;
}
