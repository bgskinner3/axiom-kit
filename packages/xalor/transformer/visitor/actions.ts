// transformer/visitor/actions.ts
import type { Node, SourceFile, TypeChecker, Type } from 'typescript';
import { addSyntheticLeadingComment, SyntaxKind } from 'typescript';
import type { TUpdateRegistry } from '../types';
import type { TSolidShape } from '../../src/models/types';

/**
 * updateRegistry
 *
 * Synchronizes the global key database and enforces unique identifiers across the project.
 */
export function updateRegistry({
  registry,
  key,
  filePath,
  symbolName,
  typeName,
}: TUpdateRegistry) {
  const existing = registry.get(key);

  if (existing) {
    const existingFile = existing.split('|')[0];
    if (filePath && existingFile !== filePath) {
      throw new Error(
        `[xalor] Collision: Key "${key}" is already defined in ${existingFile}.`,
      );
    }
  }

  registry.set(key, `${filePath ?? 'unknown'}|${symbolName}|${typeName}`);
}
/**
 *  markAsPure
 *
 * Injects a @__PURE__ comment to signal to minifiers that the call has no side effects.
 */
export function markAsPure<T extends Node>(node: T): T {
  return addSyntheticLeadingComment(
    node,
    SyntaxKind.MultiLineCommentTrivia,
    '* @__PURE__ ',
    true,
  );
}

// type TVaultSyncPayload = {
//   readonly key: string;
//   readonly filePath: string;
//   readonly symbolName: string;
//   readonly shape: TSolidShape;
// };
// export function syncVault(
//   registry: Map<string, TVaultSyncPayload>,
//   payload: TVaultSyncPayload,
// ) {
//   const existing = registry.get(payload.key);

//   if (existing) {
//     if (existing.filePath !== payload.filePath) {
//       throw new Error(
//         `[xalor] Collision: Key "${payload.key}" is already defined in ${existing.filePath}.`,
//       );
//     }
//   }

//   registry.set(payload.key, { ...payload });
// }

export type TVaultSyncPayload = {
  readonly key: string;
  readonly filePath: string; // Absolute Path
  readonly area: string; // GPS: file:line:char
  readonly symbolName: string; // TS Identity (User)
  readonly typeName: string; // Ghost Structure (import path)
  readonly shape: TSolidShape; // The Logic
  readonly version: string; // Engine Version
};

export function syncVault(
  registry: Map<string, TVaultSyncPayload>,
  payload: TVaultSyncPayload,
) {
  const existing = registry.get(payload.key);

  if (existing && existing.filePath !== payload.filePath) {
    throw new Error(
      `[xalor] 🚨 Collision: Key "${payload.key}" is defined in ${existing.filePath} and ${payload.filePath}.`,
    );
  }

  // 💎 PACKING EVERYTHING: No data left behind.
  registry.set(payload.key, payload);
}

/**
 *
 */
type TInterfaceOrType = {
  sourceFile: SourceFile;
  shapeType: Type;
  checker: TypeChecker;
  node: Node;
};
type TGeometricIdentity = {
  readonly area: string;
  readonly symbolName: string;
  readonly filePath: string;
};
export function InterfaceOrType({
  sourceFile,
  shapeType,
  checker,
  node,
}: TInterfaceOrType): TGeometricIdentity {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(),
  );
  const area = `${sourceFile.fileName}:${line + 1}:${character + 1}`;

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
    symbolName,
    filePath: sourceFile.fileName,
  };
}
