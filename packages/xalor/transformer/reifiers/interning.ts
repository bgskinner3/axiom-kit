// transformer/miner/interning.ts
import type { TSolidShape } from '../../src/models/types';
/**
 * 🧠 SHAPE FINGERPRINTS
 * A private cache that stores unique structures.
 * Key: Stringified JSON (The DNA)
 * Value: The actual TSolidShape object (The Memory Reference)
 */
const shapeCache = new Map<string, TSolidShape>();

export function internShape(shape: TSolidShape): TSolidShape {
  // 1. Create a "Fingerprint" of the shape
  const fingerprint = JSON.stringify(shape);

  // 2. Check if we've seen this exact DNA before
  const existing = shapeCache.get(fingerprint);

  if (existing) {
    // ♻️ REUSE: Throw away the new one, return the original reference
    return existing;
  }

  // 💾 RECORD: Store the new unique shape and return it
  shapeCache.set(fingerprint, shape);
  return shape;
}
