// src/generation/defaults.ts
import {
  isPrimitiveShape,
  isObjectShape,
  isArrayShape,
  isUnionShape,
  isLiteralShape,
  isBrandedShape,
} from '../utils/guards';
import { ObjectUtils } from '../../models/utils/common';
import { PRIMITIVE_DEFAULTS } from '../../models/constants';
import type { TSolidShape } from '../../models/types';
/**
 * 🎨 GET SOLID DEFAULT
 * Generates a "Zero-Value" object template based on a registered key.
 * Useful for initializing forms or state objects.
 */
export function produceDefault(shape: TSolidShape): unknown {
  if (isPrimitiveShape(shape)) return PRIMITIVE_DEFAULTS[shape.type];
  if (isLiteralShape(shape)) return shape.value;

  if (isObjectShape(shape)) {
    const obj: Record<string, unknown> = {};

    // We use Object.keys to avoid implicit any on the loop
    const keys = ObjectUtils.keys(shape.properties);

    for (const key of keys) {
      const metadata = shape.properties[key];
      if (!metadata.optional) {
        obj[key] = produceDefault(metadata.shape);
      }
    }
    return obj;
  }

  if (isArrayShape(shape)) return [];

  if (isUnionShape(shape)) return produceDefault(shape.values[0]);
  if (isBrandedShape(shape)) return produceDefault(shape.base);

  return undefined;
}
