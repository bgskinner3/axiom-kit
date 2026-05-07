// transformer/visitor/actions.ts
import type { Node } from 'typescript';
import { addSyntheticLeadingComment, SyntaxKind } from 'typescript';

type TUpdatedRegistry = {
  registry: Map<string, string>;
  key: string;
  filePath?: string;
  typeName: string;
};

/**
 * updateRegistry
 *
 * Synchronizes the global key database and enforces unique identifiers across the project.
 */
// export function updateRegistry({
//   registry,
//   key,
//   filePath,
//   typeName,
// }: TUpdatedRegistry) {
//   const existing = registry.get(key);
//   if (existing && existing.split('|')[0] !== filePath) {
//     throw new Error(
//       `[xalor] Collision: Key "${key}" is already defined in ${existing.split('|')[0]}`,
//     );
//   }
//   registry.set(key, `${filePath}|${typeName}`);
// }
export function updateRegistry({
  registry,
  key,
  filePath,
  typeName,
}: TUpdatedRegistry) {
  const existing = registry.get(key);

  // 🛡️ Safety: If the key exists, check if it's from a different file
  if (existing) {
    const existingFile = existing.split('|')[0];
    if (filePath && existingFile !== filePath) {
      throw new Error(
        `[xalor] Collision: Key "${key}" is already defined in ${existingFile}. ` +
          `Duplicate keys across different files are forbidden.`,
      );
    }
  }

  // 💎 Store both, but we will separate them in the Emitter
  registry.set(key, `${filePath ?? 'unknown'}|${typeName}`);
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
