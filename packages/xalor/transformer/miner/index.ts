// transformer/miner/index.ts
import { resolveMiningTarget } from './mining-target';
import { solidVisitorProcessor } from './processor';
import { visitEachChild } from 'typescript';
import { reifyType } from '../reifiers';
import {
  isSolidCall,
  isRegisterTarget,
  isGenerateTarget,
  isValidateTarget,
  isTransformerTarget,
} from '../utils';
import type { Visitor, Node } from 'typescript';
import { flushToRegistry } from './flush-registry';
import { getSpatialIdentity } from './spatial-identity';
import { markAsPure, enforceCollisionLaw, createMiningCtx } from './resolvers';
import type { TSolidShape } from '../../shared';
import { TMinerCorParams } from '../types';
import { logDev } from '../../shared';
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

    if (!target) {
      return visitEachChild(node, visitor, context);
    }
    if (isRegisterTarget(target)) {
      const { keyName, keyType, shapeType } = target;
      /* prettier-ignore */ logDev( `[xalor:stage-2] Targeted Key: "${keyName}" (Resolution: ${keyType.isStringLiteral() ? 'Static' : 'Dynamic'})`, { service: 'transformer/index.ts' });
      /* prettier-ignore */ const identity = getSpatialIdentity({ node, sourceFile, shapeType, checker });
      enforceCollisionLaw(keyName, identity.area, sessionRegistry);
      const fragments = new Map<string, TSolidShape>();

      const shape = reifyType({
        type: shapeType,
        checker,
        ctx: createMiningCtx(keyName, fragments),
      });
      /* prettier-ignore */ logDev( `[xalor:stage-4] Reification complete for "${keyName}". Found ${fragments.size} fragments.`, { service: 'transformer/index.ts' });

      flushToRegistry({
        key: keyName,
        shape,
        identity,
        fragments,
        globalRegistry,
        sourceFile,
      });
      /* prettier-ignore */ logDev( `[xalor:stage-6] Vault synchronized: "${keyName}" successfully solidified.`, { service: 'transformer/index.ts' });
      // PROCESS: Rewrite the AST call to inject the metadata
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ node, sourceFile, factory, target, shape,});
      return markAsPure(updatedCall);
    }
    if (isGenerateTarget(target)) {
      const { keyName, mode: _ } = target;

      /* prettier-ignore */ logDev( `[xalor:stage-6] Vault synchronized: "${keyName}" successfully solidified.`, { service: 'transformer/index.ts' });
      // PROCESS: Rewrite the AST call to inject the metadata
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ node, sourceFile, factory, target,});
      return markAsPure(updatedCall);
    }
    if (isValidateTarget(target)) {
      const { keyName, mode: _ } = target;

      /* prettier-ignore */ logDev( `[xalor:stage-6] Vault synchronized: "${keyName}" successfully solidified.`, { service: 'transformer/index.ts' });
      // PROCESS: Rewrite the AST call to inject the metadata
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ node, sourceFile, factory, target,});
      return markAsPure(updatedCall);
    }
    if (isTransformerTarget(target)) {
      const { keyName, mode: _ } = target;

      /* prettier-ignore */ logDev( `[xalor:stage-6] Vault synchronized: "${keyName}" successfully solidified.`, { service: 'transformer/index.ts' });
      // PROCESS: Rewrite the AST call to inject the metadata
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ node, sourceFile, factory, target,});
      return markAsPure(updatedCall);
    }

    return visitEachChild(node, visitor, context);
  };
  return visitor;
}
/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ORIGNAL
 */
// export function theMiner({
//   program,
//   context,
//   sourceFile,
//   globalRegistry,
//   sessionRegistry,
// }: TMinerCorParams): Visitor {
//   const checker = program.getTypeChecker();
//   const { factory } = context;

//   const visitor: Visitor = (node: Node): Node => {
//     if (!isSolidCall(node, checker)) {
//       return visitEachChild(node, visitor, context);
//     }
//     /* prettier-ignore */ logDev(`[xalor:stage-1] Found candidate call in ${sourceFile.fileName}`, { service: 'transformer/index.ts' });

//     const target = resolveMiningTarget(node, checker);
//     if (!target) {
//       return visitEachChild(node, visitor, context);
//     }

//     const { keyName, keyType, shapeType } = target;
//     // const key = keyType.isStringLiteral() ? keyType.value : 'Anonymous';
//     /* prettier-ignore */ logDev( `[xalor:stage-2] Targeted Key: "${keyName}" (Resolution: ${keyType.isStringLiteral() ? 'Static' : 'Dynamic'})`, { service: 'transformer/index.ts' });
//     /* prettier-ignore */ const identity = getSpatialIdentity({ node, sourceFile, shapeType, checker });
//     enforceCollisionLaw(keyName, identity.area, sessionRegistry);
//     const fragments = new Map<string, TSolidShape>();

//     const shape = reifyType({
//       type: shapeType,
//       checker,
//       ctx: createMiningCtx(keyName, fragments),
//     });
//     /* prettier-ignore */ logDev( `[xalor:stage-4] Reification complete for "${keyName}". Found ${fragments.size} fragments.`, { service: 'transformer/index.ts' });
//     if (keyType.isStringLiteral()) {
//       // GPS: Map the physical location and TypeScript identity

//       // SYNC: Flush fragments and the main payload to the Global Vault
//       flushToRegistry({
//         key: keyName,
//         shape,
//         identity,
//         fragments,
//         globalRegistry,
//         sourceFile,
//       });
//       /* prettier-ignore */ logDev( `[xalor:stage-6] Vault synchronized: "${keyName}" successfully solidified.`, { service: 'transformer/index.ts' });
//       // PROCESS: Rewrite the AST call to inject the metadata
//       /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key: keyName, sourceFile, node,});
//       return markAsPure(updatedCall);
//     }

//     return visitEachChild(node, visitor, context);
//   };
//   return visitor;
// }
