import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';
import type { TSolidShape, TVaultSyncPayload } from '../../src/models/types';
import type { TFlushToRegistryParams } from '../types';
import ts from 'typescript';

/**
 * 🛠️ WORKER: ENFORCE COLLISION LAW
 * Prevents two different files from claiming the same UUID.
 */
export function enforceCollisionLaw(
  key: string,
  file: string,
  session: Map<string, string>,
) {
  if (key === 'Anonymous') return;
  if (session.has(key) && session.get(key) !== file) {
    throw new Error(
      `[xalor] 🚨 COLLISION: Key "${key}" already registered in ${session.get(key)}.`,
    );
  }
  session.set(key, file);
}
/**
 * 🛠️ WORKER: CREATE MINING CTX
 */
export function createMiningCtx(
  key: string,
  fragments: Map<string, TSolidShape>,
) {
  return {
    depth: 0,
    maxDepth: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth,
    fragments,
    parentKey: key,
    seen: new Set<ts.Type>(),
  };
}
/**
 * 🛠️ WORKER: FLUSH TO REGISTRY
 * Packages the DNA and Shredded Fragments for the Bunker.
 */
// export function flushToRegistry({
//   key,
//   shape,
//   identity,
//   fragments,
//   globalRegistry,
//   sourceFile,
// }: TFlushToRegistryParams) {
//   // 1. Main Payload
//   const payload: TVaultSyncPayload = {
//     key,
//     filePath: sourceFile.fileName,
//     area: identity.area,
//     symbolName: identity.symbolName,
//     typeName: identity.typeName,
//     shape,
//     version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//   };
//   syncVault({ registry: globalRegistry, payload });

//   // 2. Shredded Fragments
//   fragments.forEach((fShape: TSolidShape, fKey: string) => {
//     globalRegistry.set(fKey, {
//       ...payload,
//       key: fKey,
//       area: `${identity.area} (Fragment)`,
//       // 📍 CHANGE: Carry the parent name into the fragment for the Auditor
//       symbolName: `${identity.symbolName} (Fragment)`,
//       typeName: 'Fragment',
//       shape: fShape,
//     });
//   });
// }
