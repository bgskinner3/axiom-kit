// transformer/miner/resolvers.ts
import { addSyntheticLeadingComment, SyntaxKind } from 'typescript';
import type { Node } from 'typescript';
import type {
  TSpatialIdentity,
  TInterfaceOrType,
  TSyncVaultParams,
  // TVaultSyncPayload,
} from '../types';
import { printGhostStructure } from './ghost-structures';

/**
 * 💎 MARK AS PURE (Minification Shield)
 *
 * ROLE:
 * - The "Bundle Optimizer." It signals to downstream tools that this function
 *   call is side-effect free.
 *
 * STRATEGY:
 * - Synthetic Annotation: Injects a @__PURE__ multi-line comment directly
 *   onto the generated AST node.
 *
 * WHY:
 * - This satisfies Commandment III (Zero-Footprint Runtime).
 * - If a developer registers a type but never actually uses it in their code,
 *   the minifier will see this tag and safely strip the metadata, preventing
 *   "Dead Code" from bloating the production bundle.
 */
export function markAsPure<T extends Node>(node: T): T {
  return addSyntheticLeadingComment(
    node,
    SyntaxKind.MultiLineCommentTrivia,
    '* @__PURE__ ',
    true,
  );
}
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
export function syncVault({ registry, payload }: TSyncVaultParams) {
  const existing = registry.get(payload.key);

  if (existing && existing.filePath !== payload.filePath) {
    throw new Error(
      `[xalor] 🚨 Collision: Key "${payload.key}" is defined in ${payload.filePath} and ${payload.filePath}.`,
    );
  }

  registry.set(payload.key, payload);
}


// transformer/miner/resolvers.ts
ADD THIS 
export function syncVault({ registry, payload }: { registry: Map<string, TVaultSyncPayload>, payload: TVaultSyncPayload }) {
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
 * 🛰️ GET SPATIAL IDENTITY (The GPS)
 *
 * ROLE:
 * - The "Identity Constructor." It maps a transient TypeScript symbol to a
 *   permanent, multi-dimensional physical record.
 *
 * STRATEGY:
 * - DUAL-TRACKING: Captures the 'area' (GPS coordinate for the Auditor) AND
 *   the 'typeName' (Nominal link for the IDE Bridge) simultaneously.
 * - EXPORT VALIDATION: Checks the source file symbol to determine if a type
 *   is public-facing or internal, setting the 'symbolName' accordingly.
 *
 * WHY:
 * - This provides the Triple-KV Vault with everything it needs in one shot.
 * - It bridges the gap between where a type "lives" (file) and where it
 *   "occurs" (line/char).
 */
export function getSpatialIdentity({
  node,
  sourceFile,
  shapeType,
  checker,
}: TInterfaceOrType): TSpatialIdentity {
  // 📍 1. THE GPS (For the Auditor)
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(),
  );
  const area = `${sourceFile.fileName}:${line + 1}:${character + 1}`;

  const typeName = printGhostStructure({ type: shapeType, checker, node });

  const symbol = shapeType.aliasSymbol || shapeType.getSymbol();
  let symbolName = 'unknown';

  if (symbol) {
    const name = symbol.getName();
    const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile);
    const isExported = !!sourceFileSymbol?.exports?.has(symbol.escapedName);
    symbolName = isExported ? name : 'unknown';
  }

  return {
    area,
    typeName,
    symbolName,
    filePath: sourceFile.fileName,
  };
}
