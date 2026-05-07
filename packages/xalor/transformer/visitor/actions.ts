// transformer/visitor/actions.ts
import type { Node } from 'typescript';
import { addSyntheticLeadingComment, SyntaxKind } from 'typescript';
import type { TUpdateRegistry } from '../types';

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
