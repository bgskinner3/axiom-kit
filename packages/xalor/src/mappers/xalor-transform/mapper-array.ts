import type { TMergeDependency, TMapperArray } from '../../models/types';
import { isArray } from '../../../shared';
/**
 * 🔗 STANDALONE ARRAY TRANSFORMATION WORKER
 *
 * ROLE:
 * Coordinates the recursive collection traversal for both standard single-source
 * pass-through loops and complex twin-collection symmetric index merges.
 */
export function transformerMapperArray({
  shape,
  data,
  dependency,
  depth,
  recurse,
}: TMapperArray) {
  // Symmetrically step through indices for both collections during a deep merge run
  if (dependency.mode === 'merge') {
    const list1 = isArray(data) ? data : [];
    const list2 = isArray(dependency.patchData) ? dependency.patchData : [];
    const maxLength = Math.max(list1.length, list2.length);

    const copy: unknown[] = [];
    for (let i = 0; i < maxLength; i++) {
      const itemChildDependency: TMergeDependency = {
        mode: 'merge',
        patchData: list2[i],
      };
      copy[i] = recurse(list1[i], shape.items, itemChildDependency, depth + 1);
    }
    return copy;
  }

  // Standard single-source stream array passthrough
  if (!isArray(data)) return [];
  const copy: unknown[] = [];
  for (let i = 0; i < data.length; i++) {
    copy[i] = recurse(data[i], shape.items, dependency, depth + 1);
  }
  return copy;
}
