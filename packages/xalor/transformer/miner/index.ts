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
): Visitor {
  const checker = program.getTypeChecker();
  const { factory } = context;

  const visitor: Visitor = (node: Node): Node => {
    if (!isSolidCall(node, checker)) {
      return visitEachChild(node, visitor, context);
    }

    if (!node.typeArguments || node.typeArguments.length < 2) return node;

    const { keyType, shapeType } = identifySolidCall({ node, checker });
    const shape = reifyType(shapeType, checker, new Set());

    if (keyType.isStringLiteral()) {
      const key = keyType.value;
      const identity = getSpatialIdentity({
        node,
        sourceFile,
        shapeType,
        checker,
      });

      const payload: TVaultSyncPayload = {
        key,
        filePath: sourceFile.fileName,
        area: identity.area,
        symbolName: identity.symbolName,
        typeName: identity.typeName,
        shape,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
      } satisfies TVaultSyncPayload;

      syncVault({ registry: globalRegistry, payload });
      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
      return markAsPure(updatedCall);
    }

    return visitEachChild(node, visitor, context);
  };

  return visitor;
}
