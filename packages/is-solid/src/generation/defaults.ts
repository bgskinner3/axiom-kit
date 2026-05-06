// src/generation/defaults.ts
import {
  isPrimitiveShape,
  isObjectShape,
  isArrayShape,
  isUnionShape,
  isLiteralShape,
  isBrandedShape,
} from '../../models/guards';
import { ObjectUtils } from '../../models/utils/common';
import { PRIMITIVE_DEFAULTS } from '../../models/constants';
/**
 * 🎨 PRODUCE DEFAULT
 * Recursively generates a "Zero-Value" template from a Solid Shape.
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
// export function produceDefault(shape: TSolidShape): any {
//   if (isPrimitiveShape(shape)) {
//     switch (shape.type) {
//       case 'string':
//         return '';
//       case 'number':
//         return 0;
//       case 'boolean':
//         return false;
//       case 'bigint':
//         return BigInt(0);
//       default:
//         return undefined;
//     }
//   }

//   if (isLiteralShape(shape)) return shape.value;

//   if (isObjectShape(shape)) {
//     const obj: Record<string, any> = {};
//     for (const [key, meta] of Object.entries(shape.properties)) {
//       // Logic: Skip optional fields to keep the default object minimal
//       if (!meta.optional) {
//         obj[key] = produceDefault(meta.shape);
//       }
//     }
//     return obj;
//   }

//   if (isArrayShape(shape)) return [];

//   if (isUnionShape(shape)) {
//     // Logic: Pick the first variant in the union as the default
//     return produceDefault(shape.values[0]);
//   }

//   if (isBrandedShape(shape)) return produceDefault(shape.base);

//   return undefined;
// }
/**
 import { produceDefault } from './validation/defaults';

 * 🎨 GET SOLID DEFAULT
 * Generates a "Zero-Value" object template based on a registered key.
 * Useful for initializing forms or state objects.
export function getSolidDefault<T>(key: string): T {
  const metadata = Registry.get(key);
  
  if (!metadata) {
    throw new Error(
      `[is-solid] Cannot generate default: Key "${key}" not found. ` +
      `Ensure the type is registered before calling getSolidDefault.`
    );
  }

  return produceDefault(metadata.shape) as T;
}
 */
