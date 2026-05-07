// transformer/visitor/index.ts
import { identifySolidCall } from './detector';
import { reifyType } from '../reifiers';
import { solidVisitorProcessor } from './processor';
import { isSolidCall } from '../utils';
import { printGhostStructure } from './ghost-structures';
import { visitEachChild } from 'typescript';
import type {
  Program,
  TransformationContext,
  SourceFile,
  Visitor,
  Node,
} from 'typescript';
import { updateRegistry, markAsPure } from './actions';

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
export function createVisitor(
  program: Program,
  context: TransformationContext,
  sourceFile: SourceFile,
  globalRegistry: Map<string, string>,
): Visitor {
  const checker = program.getTypeChecker();
  const { factory } = context;

  const visitor: Visitor = (node: Node): Node => {
    // 🚩 CHECKPOINT 1: Is the Detector seeing the function name?
    if (!isSolidCall(node, checker)) {
      return visitEachChild(node, visitor, context);
    }
    // console.log(
    //   `[xalor-debug] Found target function call in: ${sourceFile.fileName}`,
    // );

    // 🚩 CHECKPOINT 2: Are the Generics missing?
    // If you use isXalor<User>(data), length is 1. If <'KEY', User>, length is 2.
    if (!node.typeArguments || node.typeArguments.length < 2) {
      console.warn(
        `[xalor-debug] Call skipped: Expected 2 generics, found ${node.typeArguments?.length || 0}`,
      );
      return node;
    }

    const { keyType, shapeType } = identifySolidCall({ node, checker });

    if (keyType.isStringLiteral()) {
      const key = keyType.value;

      /**
       * !!! HERE we validate teh type of typed OBJECT ... sounds weird ...
       *  we deteremine if it is either an INTERFACE or a type ...
       * fyi interfaces are eaiser to pick up on
       */
      const symbol = shapeType.aliasSymbol || shapeType.getSymbol();
      let symbolName = 'unknown';

      if (symbol) {
        const name = symbol.getName();
        const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile);

        const isExported = !!sourceFileSymbol?.exports?.has(symbol.escapedName);
        symbolName = isExported ? name : 'unknown';
      }

      const typeName = printGhostStructure({ type: shapeType, checker, node });

      /* prettier-ignore */ updateRegistry({ registry: globalRegistry, key, filePath: sourceFile.fileName, symbolName, typeName, });
      const shape = reifyType(shapeType, checker, new Set());

      /* prettier-ignore */ const updatedCall = solidVisitorProcessor({ shape, factory, key, sourceFile, node,});
      return markAsPure(updatedCall);
    } else {
      console.warn(
        `[xalor-debug] Key is not a string literal. Type found: ${checker.typeToString(keyType)}`,
      );
    }

    return visitEachChild(node, visitor, context);
  };

  return visitor;
}
