// transformer/visitor/actions.ts
import type { Node } from 'typescript';
import { addSyntheticLeadingComment, SyntaxKind } from 'typescript';
/**
 * updateRegistry
 *
 * Synchronizes the global key database and enforces unique identifiers across the project.
 */
export function updateRegistry(
  registry: Map<string, string>,
  key: string,
  filePath: string,
  typeName: string,
) {
  const existing = registry.get(key);
  if (existing && existing.split('|')[0] !== filePath) {
    throw new Error(
      `[is-solid] Collision: Key "${key}" is already defined in ${existing.split('|')[0]}`,
    );
  }
  registry.set(key, `${filePath}|${typeName}`);
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
