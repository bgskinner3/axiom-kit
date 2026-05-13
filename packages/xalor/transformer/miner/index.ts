// transformer/miner/index.ts
import { resolveMiningTarget } from './mining-target';
import { solidVisitorProcessor } from './processor';
import { visitEachChild } from 'typescript';
import { reifyType } from '../reifiers';
import { isSolidCall } from '../utils';
import type { Visitor, Node } from 'typescript';
import { flushToRegistry } from './flush-registry';
import { getSpatialIdentity } from './spatial-identity';
import { markAsPure, enforceCollisionLaw, createMiningCtx } from './resolvers';
import type { TSolidShape } from '../../src/models/types';
import { TMinerCorParams } from '../types';
import { logDev } from '../../src/utils';
/**
 * THE MINER (Build-Time DNA Extraction)
 *
 * ROLE:
 * Orchestrates the reification of static TypeScript types into physical
 * JSON blueprints. It acts as the "Surgical Drill" of the ecosystem.
 *
 * WORKFLOW:
 * 1.  SCOUT (Stage 1): Identifies 'isXalor' or 'registerXalor' calls via the AST.
 * 2.  HARVEST (Stage 2): Resolves the Target via Generic <T> or physical Data.
 * 3.  GUARD (Stage 3): Enforces UUID uniqueness to prevent data collisions.
 * 4.  REIFY (Stage 4): Recursively mines the TS Type into a TSolidShape.
 * 5.  MAPPING (Stage 5): Captures GPS coordinates (area) for the Auditor.
 * 6.  FLUSH (Stage 6): Persists the reified DNA and fragments into the Vault.
 * 7.  REWRITE (Stage 7): Injects the metadata back into the JS source.
 */
export function theMiner({
  program,
  context,
  sourceFile,
  globalRegistry,
  sessionRegistry,
}: TMinerCorParams): Visitor {
  const checker = program.getTypeChecker();
  const { factory } = context;

  const visitor: Visitor = (node: Node): Node => {
    if (!isSolidCall(node, checker)) {
      return visitEachChild(node, visitor, context);
    }
    /* prettier-ignore */ logDev(`[xalor:stage-1] Found candidate call in ${sourceFile.fileName}`, { service: 'transformer/index.ts' });

    const target = resolveMiningTarget(node, checker);
    if (!target) return node;

    const { keyType, shapeType } = target;
    const key = keyType.isStringLiteral() ? keyType.value : 'Anonymous';
    /* prettier-ignore */ logDev( `[xalor:stage-2] Targeted Key: "${key}" (Resolution: ${keyType.isStringLiteral() ? 'Static' : 'Dynamic'})`, { service: 'transformer/index.ts' });
    enforceCollisionLaw(key, sourceFile.fileName, sessionRegistry);
    const fragments = new Map<string, TSolidShape>();

    const shape = reifyType({
      type: shapeType,
      checker,
      ctx: createMiningCtx(key, fragments),
    });
    /* prettier-ignore */ logDev( `[xalor:stage-4] Reification complete for "${key}". Found ${fragments.size} fragments.`, { service: 'transformer/index.ts' });
    if (keyType.isStringLiteral()) {
      // GPS: Map the physical location and TypeScript identity
      /* prettier-ignore */ const identity = getSpatialIdentity({ node, sourceFile, shapeType, checker });
      // SYNC: Flush fragments and the main payload to the Global Vault
      flushToRegistry({
        key,
        shape,
        identity,
        fragments,
        globalRegistry,
        sourceFile,
      });
      /* prettier-ignore */ logDev( `[xalor:stage-6] Vault synchronized: "${key}" successfully solidified.`, { service: 'transformer/index.ts' });
      // PROCESS: Rewrite the AST call to inject the metadata
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
      return markAsPure(updatedCall);
    }

    return visitEachChild(node, visitor, context);
  };
  return visitor;
}
// ORIGINAL
// export function theMiner(
//   program: Program,
//   context: TransformationContext,
//   sourceFile: SourceFile,
//   globalRegistry: Map<string, TVaultSyncPayload>,
//   sessionRegistry: Map<string, string>,
// ): Visitor {
//   const checker = program.getTypeChecker();
//   const { factory } = context;
//   const { solidVersion, reifyLimit } = IS_SOLID_CONFIG_ITEMS;

//   const visitor: Visitor = (node: Node): Node => {
//     if (!isSolidCall(node, checker)) {
//       return visitEachChild(node, visitor, context);
//     }

//     if (!node.typeArguments || node.typeArguments.length < 2) return node;

//     const { keyType, shapeType } = identifySolidCall({ node, checker });
//     const key = keyType.isStringLiteral() ? keyType.value : 'Anonymous';
//     if (keyType.isStringLiteral()) {
//       const filePath = sourceFile.fileName;

//       if (sessionRegistry.has(key)) {
//         const originalFile = sessionRegistry.get(key);
//         throw new Error(
//           `[xalor] 🚨 BUILD-TIME COLLISION: Key "${key}" is already registered in ${originalFile}. ` +
//             `Every unique type must have a unique UUID. Attempted re-use in ${filePath}.`,
//         );
//       }
//       // Log the key to this build session
//       sessionRegistry.set(key, filePath);
//     }
//     const fragments = new Map<string, TSolidShape>();

//     const shape = reifyType({
//       type: shapeType,
//       checker,
//       ctx: {
//         depth: 0,
//         maxDepth: reifyLimit.maxDepth,
//         fragments,
//         parentKey: key,
//         seen: new Set(),
//       },
//     });

//     if (keyType.isStringLiteral()) {
//       const identity = getSpatialIdentity({
//         node,
//         sourceFile,
//         shapeType,
//         checker,
//       });

//       /**
//        * 💎 THE FRAGMENT FLUSH
//        * We iterate through any chopped pieces and register them as
//        * top-level "Solid" entries so they persist in the Vault.
//        */

//       fragments.forEach((fShape, fKey) => {
//         globalRegistry.set(fKey, {
//           key: fKey,
//           filePath: sourceFile.fileName,
//           area: `${identity.area} (Fragment)`,
//           symbolName: 'AnonymousFragment',
//           typeName: 'Fragment',
//           shape: fShape,
//           version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//         });
//       });
//       const payload: TVaultSyncPayload = {
//         key,
//         filePath: sourceFile.fileName,
//         area: identity.area,
//         symbolName: identity.symbolName,
//         typeName: identity.typeName,
//         shape,
//         version: solidVersion,
//       } satisfies TVaultSyncPayload;

//       /* prettier-ignore */ syncVault({ registry: globalRegistry, payload });
//       /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
//       return markAsPure(updatedCall);
//     }

//     return visitEachChild(node, visitor, context);
//   };

//   return visitor;
// }
