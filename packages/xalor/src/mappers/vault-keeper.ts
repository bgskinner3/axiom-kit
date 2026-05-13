import type { TRectifierRegistryMapper } from '../models/types';
import { IS_SOLID_CONFIG_ITEMS } from '../models/constants';
/**
 * 🗄️ UNIFIED METADATA RECTIFIER MAPPER
 *
 * ROLE:
 * The single source of structural transformation truth for metadata envelopes.
 *
 * STRATEGY:
 * - High-Speed String Slicing: Uses index positions instead of creating array allocations.
 * - Flat Isolation: Isolates field mutations into atomic, self-contained handlers.
 */
export const RECTIFIER_REGISTRY_MAPPER: TRectifierRegistryMapper = {
  // --- BASICS (Pass-Through Channels) ---
  key: (input) => input.key,
  area: (input) => input.area,
  version: (input) =>
    input.version ? input.version : IS_SOLID_CONFIG_ITEMS.solidVersion,
  shape: (input) => input.shape,

  filePath: (input) => {
    if (input.filePath) return input.filePath;

    const areaStr = input.area;
    const colonIndex = areaStr.indexOf(':');
    return colonIndex !== -1
      ? areaStr.substring(0, colonIndex)
      : 'unknown_path.ts';
  },
  symbolName: (input) => {
    return input.symbolName ?? 'unknown';
  },
  typeName: (input) => {
    if (input.typeName) return input.typeName;
    // Fallback to symbol or a generic placeholder
    return input.symbolName || `T${input.key}`;
  },
} satisfies TRectifierRegistryMapper;
