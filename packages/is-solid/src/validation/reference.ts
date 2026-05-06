// src/validation/references.ts
import { Registry } from '../vault';
import type {
  TValidationContext,
  TSolidReferenceShape,
} from '../../models/types';
import { validate } from './index';
import { reportError } from './errors';

export function validateReference(
  data: unknown,
  shape: TSolidReferenceShape,
  ctx: TValidationContext,
): boolean {
  const metadata = Registry.get(shape.name);

  if (!metadata) {
    return reportError(
      ctx,
      `Registered Shape: ${shape.name}`,
      'Missing from Vault',
    );
  }

  return validate(data, metadata.shape, ctx);
}

// export function validateReference(
//   data: unknown,
//   shape: TSolidReferenceShape, // 💎 Strict type
//   ctx: TValidationContext,
// ): boolean {
//   const metadata = Registry.get(shape.name);
//   if (!metadata) return false;

//   return validate(data, metadata.shape, ctx);
// }
