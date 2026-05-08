// transformer/reifiers/reify-type.ts
import type { Type, TypeChecker } from 'typescript';
import { REIFIERS } from './registry/index';
import type { TSolidShape } from '../../src/models/types';
import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';
import { TReifyDispatcherBuild, TReifyCTX } from '../types';

const DEFAULT_REIFY_CTX: TReifyCTX = {
  depth: 0,
  maxDepth: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth,
  fragments: new Map(),
  parentKey: 'root',
  seen: new Set(),
} satisfies TReifyCTX;

export function reifyType({
  type,
  checker,
  ctx = DEFAULT_REIFY_CTX,
}: TReifyDispatcherBuild): TSolidShape {
  if (ctx.depth >= ctx.maxDepth) {
    // 1. Generate a "Volume 2" key
    const fragmentKey = `${ctx.parentKey}$d${ctx.depth}`;

    // 2. We reset depth for the tail to allow it to be reified properly
    const tailCtx: TReifyCTX = {
      ...ctx,
      depth: 0,
      parentKey: fragmentKey,
    };

    // 3. Reify the "Tail" and store it in the bucket
    const tailShape = runReifierLoop(type, checker, tailCtx);
    ctx.fragments.set(fragmentKey, tailShape);

    // 4. Return the Pointer
    return { kind: 'reference', name: fragmentKey };
  }

  return runReifierLoop(type, checker, ctx);
}
function runReifierLoop(
  type: Type,
  checker: TypeChecker,
  ctx: TReifyCTX,
): TSolidShape {
  for (const reifier of REIFIERS) {
    // We pass ctx down so workers can increment depth
    const result = reifier(
      type,
      checker,
      (t, nextCtx) => reifyType({ type: t, checker, ctx: nextCtx }),
      ctx,
    );
    if (result) return result;
  }
  return { kind: 'primitive', type: 'unknown' };
}
/**
 * REIFYTYPE
 * The primary entry point for converting a TypeScript Type into a TSolidShape.
 * It implements a "Middleware Dispatcher" pattern, looping through the
 * registered Reifiers until a match is found.
 *
 * @param type - The raw TypeScript Type symbol to be analyzed.
 * @param checker - The Program's TypeChecker for deep metadata extraction.
 * @param seen - A persistent Set used for "Ghost Loop" protection (recursion).
 *
 * @returns {TSolidShape} The serialized JSON-friendly blueprint of the type.
 */
// export function reifyType(prosp: TReifyDispatcherBuild): TSolidShape {
//   for (const reifier of REIFIERS) {
//     const result = reifier(
//       type,
//       checker,
//       (t) => reifyType(t, checker, seen),
//       seen,
//     );

//     if (result) return result;
//   }

//   return { kind: 'primitive', type: 'unknown' };
// }
/**
 * 
export function reifyType(
  type: Type,
  checker: TypeChecker,
  ctx: {
    depth: number;
    fragments: Map<string, TSolidShape>;
    parentKey: string;
    seen: Set<Type>;
  } = { depth: 0, fragments: new Map(), parentKey: 'root', seen: new Set() }
): TSolidShape {
  const { limits } = IS_SOLID_CONFIG_ITEMS;

  // 🛡️ THE GATEKEEPER: Check if we hit the "Pyramid of Doom" limit
  if (ctx.depth >= limits.maxDepth) {
    // 1. Create a unique Virtual Key for the tail
    const virtualKey = `${ctx.parentKey}$depth${ctx.depth}`;

    // 2. Chop the tail: Reify it with a reset depth
    // This prevents the tail itself from being "infinitely deep"
    const tailShape = runReifiers(type, checker, { ...ctx, depth: 0 });

    // 3. Save the tail to the Fragment Bucket
    ctx.fragments.set(virtualKey, tailShape);

    // 4. Return a Reference instead of the deep object
    return { kind: 'reference', key: virtualKey };
  }

  // 🔄 THE DISPATCHER: Normal recursive loop
  return runReifiers(type, checker, ctx);
}
 */
