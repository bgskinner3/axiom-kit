// transformer/miner/index.ts
import { identifySolidCall } from './detector';
import { solidVisitorProcessor } from './processor';
import { visitEachChild } from 'typescript';
import { reifyType } from '../reifiers';
import { isSolidCall } from '../utils';
import type {
  Program,
  TransformationContext,
  SourceFile,
  Visitor,
  Node,
} from 'typescript';
import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';
import { markAsPure, syncVault, getSpatialIdentity } from './resolvers';
import type { TVaultSyncPayload } from '../types';
import type { TSolidShape } from '../../src/models/types';

/**
 * The Miner (Build-Time Extraction)
 *
 * The createVisitor function orchestrates the transformation process. It scans
 * the Abstract Syntax Tree (AST), identifies `isSolid` calls, and bridges
 * the gap between static TypeScript types and runtime JavaScript metadata.
 *
 * Workflow:
 * 1. SCAN: Traverses the file node by node.
 * 2. IDENTIFY: Uses `isSolidCall` to find the target function.
 * 3. ANALYZE: Queries the TypeChecker to resolve the generic <Key, Type>.
 * 4. REGISTRY: Logs the Key and its origin file to the Global Vault Index.
 * 5. REIFY: Recursively converts the TS Type into a JSON-friendly "Solid Shape".
 * 6. PROCESS: Replaces the original call with optimized runtime registration logic.
 */
export function theMiner(
  program: Program,
  context: TransformationContext,
  sourceFile: SourceFile,
  globalRegistry: Map<string, TVaultSyncPayload>,
  sessionRegistry: Map<string, string>,
): Visitor {
  const checker = program.getTypeChecker();
  const { factory } = context;
  const { solidVersion, reifyLimit } = IS_SOLID_CONFIG_ITEMS;

  const visitor: Visitor = (node: Node): Node => {
    if (!isSolidCall(node, checker)) {
      return visitEachChild(node, visitor, context);
    }

    if (!node.typeArguments || node.typeArguments.length < 2) return node;

    const { keyType, shapeType } = identifySolidCall({ node, checker });
    const key = keyType.isStringLiteral() ? keyType.value : 'Anonymous';
    if (keyType.isStringLiteral()) {
      const filePath = sourceFile.fileName;

      if (sessionRegistry.has(key)) {
        const originalFile = sessionRegistry.get(key);
        throw new Error(
          `[xalor] 🚨 BUILD-TIME COLLISION: Key "${key}" is already registered in ${originalFile}. ` +
            `Every unique type must have a unique UUID. Attempted re-use in ${filePath}.`,
        );
      }
      // Log the key to this build session
      sessionRegistry.set(key, filePath);
    }
    const fragments = new Map<string, TSolidShape>();

    const shape = reifyType({
      type: shapeType,
      checker,
      ctx: {
        depth: 0,
        maxDepth: reifyLimit.maxDepth,
        fragments,
        parentKey: key,
        seen: new Set(),
      },
    });

    if (keyType.isStringLiteral()) {
      const identity = getSpatialIdentity({
        node,
        sourceFile,
        shapeType,
        checker,
      });

      /**
       * 💎 THE FRAGMENT FLUSH
       * We iterate through any chopped pieces and register them as
       * top-level "Solid" entries so they persist in the Vault.
       */

      fragments.forEach((fShape, fKey) => {
        globalRegistry.set(fKey, {
          key: fKey,
          filePath: sourceFile.fileName,
          area: `${identity.area} (Fragment)`,
          symbolName: 'AnonymousFragment',
          typeName: 'Fragment',
          shape: fShape,
          version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        });
      });
      const payload: TVaultSyncPayload = {
        key,
        filePath: sourceFile.fileName,
        area: identity.area,
        symbolName: identity.symbolName,
        typeName: identity.typeName,
        shape,
        version: solidVersion,
      } satisfies TVaultSyncPayload;

      /* prettier-ignore */ syncVault({ registry: globalRegistry, payload });
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
      return markAsPure(updatedCall);
    }

    return visitEachChild(node, visitor, context);
  };

  return visitor;
}

// export function theMiner(
//   program: Program,
//   context: TransformationContext,
//   sourceFile: SourceFile,
//   globalRegistry: Map<string, TVaultSyncPayload>,
// ): Visitor {
//   const checker = program.getTypeChecker();
//   const { factory } = context;

//   const visitor: Visitor = (node: Node): Node => {
//     if (!isSolidCall(node, checker)) {
//       return visitEachChild(node, visitor, context);
//     }

//     if (!node.typeArguments || node.typeArguments.length < 2) return node;

//     const { keyType, shapeType } = identifySolidCall({ node, checker });
//     const shape = reifyType(shapeType, checker, new Set());

//     if (keyType.isStringLiteral()) {
//       const key = keyType.value;
//       const identity = getSpatialIdentity({
//         node,
//         sourceFile,
//         shapeType,
//         checker,
//       });

//       const payload: TVaultSyncPayload = {
//         key,
//         filePath: sourceFile.fileName,
//         area: identity.area,
//         symbolName: identity.symbolName,
//         typeName: identity.typeName,
//         shape,
//         version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//       } satisfies TVaultSyncPayload;

//       if (key === 'BigTEst') {
//         // 👉 ADD THESE LINES HERE:
//         console.log(`\n--- 💎 SOLID BLUEPRINT: ${key} ---`);
//         try {
//           console.log(JSON.stringify(shape, null, 2));
//         } catch (e) {
//           console.log(
//             '⚠️ CIRCULAR DEP DETECTED: Deep nesting failed. Using inspect instead:',
//           );
//           console.dir(shape, { depth: null, colors: true });
//         }
//         console.log('---------------------------------\n');
//       }

//       syncVault({ registry: globalRegistry, payload });
//       /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
//       return markAsPure(updatedCall);
//     }

//     return visitEachChild(node, visitor, context);
//   };

//   return visitor;
// }
/**
 {
  "version": "1.0.0",
  "blueprints": {
    "USER": {
      "kind": "object",
      "properties": {
        "id": { "shape": { "kind": "primitive", "type": "number" }, "optional": false, "name": "id" },
        "name": { "shape": { "kind": "primitive", "type": "string" }, "optional": false, "name": "name" }
      }
    },
    "MY_BALLS": {
      "kind": "object",
      "properties": {
        "myLeftNut": { "shape": { "kind": "primitive", "type": "number" }, "optional": false, "name": "myLeftNut" },
        "myRightNut": { "shape": { "kind": "primitive", "type": "string" }, "optional": false, "name": "myRightNut" }
      }
    },
    "BigTEst": {
      "kind": "object",
      "properties": {
        "yourTingWinner": { "shape": { "kind": "primitive", "type": "string" }, "optional": false, "name": "yourTingWinner" },
        "moreStuff": { "shape": { "kind": "reference", "name": "BigTEst$d1" }, "optional": false, "name": "moreStuff" }
      }
    },
    "BigTEst$d1": {
      "kind": "object",
      "properties": {
        "id": { "shape": { "kind": "primitive", "type": "string" }, "optional": false, "name": "id" },
        "moreItems": { "shape": { "kind": "object", "properties": { "money": { "shape": { "kind": "primitive", "type": "unknown" }, "optional": false, "name": "money" } } }, "optional": false, "name": "moreItems" }
      }
    }
  },
  "manifest": {
    "USER": { "area": "test-file.ts:14:5", "filePath": "test-file.ts" },
    "MY_BALLS": { "area": "is-xalor.test.ts:141:5", "filePath": "__tests__/runtime/operations/core/is-xalor.test.ts" },
    "BigTEst": { "area": "is-xalor.test.ts:142:5", "filePath": "__tests__/runtime/operations/core/is-xalor.test.ts" }
  },
  "registry": {
    "USER": { "symbolName": "User", "typeName": "{ id: number; name: string; }" },
    "MY_BALLS": { "symbolName": "TFUCKKKKTT", "typeName": "{ myLeftNut: number; myRightNut: string; }" },
    "BigTEst": { "symbolName": "BigTEst", "typeName": "{ yourTingWinner: string; moreStuff: { ... }; }" }
  }
}

 */
