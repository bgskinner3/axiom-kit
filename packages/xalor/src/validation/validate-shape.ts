// src/validation/solidify-shape.ts
import type { TValidationContext, TSolidShape } from '../models/types';
import { createInitialContext } from './context';
import { isObject, isNull, isFunction } from '../utils/guards';
import { SHAPE_VALIDATION_MAPPER } from '../mappers';
/**
 * 💎 solidify
 * Attests that raw data conforms to a TSolidShape blueprint.
 *
 * INVARIANTS:
 * - Prevents infinite recursion via Graph Integrity checks (ctx.seen).
 * - Routes execution to the specialized Validator Mapper.
 */
export function validateShape(
  data: unknown,
  shape: TSolidShape,
  ctx: TValidationContext = createInitialContext(),
): boolean {
  // 🛡️ 1. THE DEPTH LAW (Security)
  if (ctx.depth > 25) return false;

  // 🛡️ 2. RECURSION PROTECTION (Graph Integrity)
  if (isObject(data) && !isNull(data)) {
    let seenShapes = ctx.seen.get(data);
    if (seenShapes?.has(shape)) return true;

    if (!seenShapes) {
      seenShapes = new Set([shape]);
      ctx.seen.set(data, seenShapes);
    } else {
      seenShapes.add(shape);
    }
  }

  // 🚀 3. DYNAMIC ROUTING
  const validator = SHAPE_VALIDATION_MAPPER[shape.kind];

  // 🛑 THE INTEGRITY CHECK
  // This ensures that if the Bunker has a "Corrupted Kind"
  // (e.g. from an old version), we don't crash the whole app.
  if (!isFunction(validator)) {
    throw new Error(
      `[xalor] 🚨 Unsupported shape kind: "${shape.kind}". ` +
        `Check your Bunker version against the current Engine.`,
    );
  }

  // 🎯 4. EXECUTION (The recursive jump)
  // We increment depth here so nested workers know they are deeper
  ctx.depth++;
  const result = validator(data, shape, ctx);
  ctx.depth--; // Backtrack so siblings aren't penalized

  return result;
}
