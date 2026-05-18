// transformer/miner/resolvers.ts
import { addSyntheticLeadingComment, SyntaxKind } from 'typescript';
import type { Node, Type } from 'typescript';
import type { TSolidShape } from '../../shared';
import { IS_SOLID_CONFIG_ITEMS } from '../../shared';

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
 * 🛡️ ENFORCE COLLISION LAW
 *
 * ROLE:
 * The "Integrity Guard." It ensures that every UUID in the Xalor ecosystem
 * is truly unique within the current build session.
 *
 * STRATEGY:
 * - Session Tracking: Compares the incoming key against a Map of keys already
 *   claimed by other files in this build.
 * - Exception: Ignores 'Anonymous' keys (internal fragments) to allow
 *   flexible shredding.
 *
 * WHY:
 * Prevents "Silent Data Corruption" where two different types share the same
 * key, causing the Validator to use the wrong blueprint at runtime.
 */
export function enforceCollisionLaw(
  key: string,
  area: string,
  session: Map<string, string>,
) {
  if (key === 'Anonymous') return;
  if (session.has(key)) {
    throw new Error(
      `[xalor] 🚨 COLLISION: Key "${key}" already registered in ${session.get(key)}. ` +
        `Every unique type must have a unique UUID.`,
    );
  }
  session.set(key, area);
}

/**
 * 🏗️ CREATE MINING CTX
 *
 * ROLE:
 * The "Notebook." Initializes the recursive state for the Reification engine.
 *
 * STRATEGY:
 * - Depth Sync: Seeds the limit from IS_SOLID_CONFIG_ITEMS to ensure
 *   Atomic Cutting happens at the correct level.
 * - Fragment Drawer: Provides an empty Map to collect shredded pieces
 *   encountered during the walk.
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
    seen: new Set<Type>(),
  };
}
