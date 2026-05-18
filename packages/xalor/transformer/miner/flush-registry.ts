import { IS_SOLID_CONFIG_ITEMS } from '../../shared';
import type { TSolidShape, TVaultSyncPayload } from '../../shared';
import type { TFlushToRegistryParams } from '../types';
import * as path from 'path';
/**
 * 📦 SYNC VAULT (The Accumulator)
 *
 * ROLE:
 * - The "Integrity Guard." It manages the Stage 3 (Accumulation) Map
 *   and enforces the Single Source of Truth.
 *
 * STRATEGY:
 * - COLLISION DETECTION: Explicitly blocks two different files from claiming
 *   the same string key to prevent silent data corruption.
 * - TOTAL PACKING: Ensures the high-definition payload (GPS, Identity, Shape)
 *   is preserved for the Stage 4 (Persist) flush.
 *
 * WHY:
 * - This satisfies Commandment I. By catching collisions here, we prevent
 *   buggy builds from ever reaching the node_modules cache.
 */
export function syncVault({
  registry,
  payload,
}: {
  registry: Map<string, TVaultSyncPayload>;
  payload: TVaultSyncPayload;
}) {
  // 💎 The Law: No "Leakage"
  // We ensure the payload is perfectly shaped for the 3 Vaults before it hits the Map.
  registry.set(payload.key, {
    ...payload,
    // Ensure path is relative to root for the Manifest
    filePath: path.relative(process.cwd(), payload.filePath),
    // Ensure shape is the "Atomic" version
    shape: payload.shape,
  });
}
/**
 * 📦 FLUSH TO REGISTRY
 *
 * ROLE:
 * The "Bunker Loader." Packages reified DNA and its shredded fragments
 * into a format ready for Stage 4 Persistence.
 *
 * STRATEGY:
 * - Metadata Envelope: Wraps the raw shape in traceability data (GPS, Version).
 * - Fragment Inheritance: Ensures every shredded piece carries the 'Root GPS'
 *   of its parent so the Auditor can always find the source.
 *
 * WHY:
 * Centralizes the transformation from "TypeScript Memory" to "Physical JSON Storage."
 */
export function flushToRegistry({
  key,
  shape,
  identity,
  fragments,
  globalRegistry,
  sourceFile,
}: TFlushToRegistryParams) {
  // 1. Prepare Main Payload
  const payload: TVaultSyncPayload = {
    key,
    filePath: sourceFile.fileName,
    area: identity.area,
    symbolName: identity.symbolName,
    typeName: identity.typeName,
    shape,
    version: IS_SOLID_CONFIG_ITEMS.solidVersion,
  };

  // 🚀 Solidify the primary type
  syncVault({ registry: globalRegistry, payload });

  // 2. Solidify shredded fragments
  fragments.forEach((fShape: TSolidShape, fKey: string) => {
    globalRegistry.set(fKey, {
      ...payload,
      key: fKey,
      area: `${identity.area} (Fragment)`,
      symbolName: `${identity.symbolName} (Fragment)`,
      typeName: 'Fragment',
      shape: fShape,
    });
  });
}
