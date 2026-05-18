// transformer/miner/processor.ts
import type { ObjectLiteralExpression } from 'typescript';
import type { TCreateSolidMetadata, TSolidVisitorProcessor } from '../types';
import { generateShapeAST } from '../reifiers';
import { IS_SOLID_CONFIG_ITEMS } from '../../shared';

// function resolveGenerateXalorCall(
//   node: ts.CallExpression,
//   checker: ts.TypeChecker,
// ) {
//   const typeArgs = node.typeArguments ?? [];
//   const args = node.arguments ?? [];

//   let key: string | undefined;
//   let mode: string | undefined;
//   let data: unknown;

//   // --- CASE 1: generics <K, M>
//   if (typeArgs.length >= 2) {
//     const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
//     const modeType = checker.getTypeFromTypeNode(typeArgs[1]);

//     if (keyType.isStringLiteral()) key = keyType.value;
//     if (modeType.isStringLiteral()) mode = modeType.value;
//   }

//   // --- CASE 2: runtime args
//   if (args.length >= 1 && !key) {
//     const maybeKey = args[0];
//     if (ts.isStringLiteral(maybeKey)) {
//       key = maybeKey.text;
//     }
//   }

//   if (args.length >= 2 && !mode) {
//     const maybeMode = args[1];
//     if (ts.isStringLiteral(maybeMode)) {
//       mode = maybeMode.text;
//     }
//   }

//   if (args.length >= 3) {
//     data = args[2];
//   }

//   return { key, mode, data };
// }
function createSolidMetadata({
  factory,
  areaString,
  key,
  shape,
}: TCreateSolidMetadata): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression([
    /* prettier-ignore */ factory.createPropertyAssignment('key', factory.createStringLiteral(key)),
    /* prettier-ignore */ factory.createPropertyAssignment('area',factory.createStringLiteral(areaString)),
    /* prettier-ignore */ factory.createPropertyAssignment('version', factory.createStringLiteral(IS_SOLID_CONFIG_ITEMS.solidVersion)),
    /* prettier-ignore */ factory.createPropertyAssignment('shape', generateShapeAST(factory, shape)),
  ]);
}
/**
 *
 * ROLE:
 * - The "Rewriter." It intercepts the ghost call and replaces it with a
 *   high-performance runtime registration.
 *
 * STRATEGY:
 * - Geometric Injection: Calculates the GPS coordinate (line:char) at the
 *   last possible second to ensure pinpoint accuracy for the Auditor.
 * - AST Reification: Converts the JSON "Solid Shape" into a physical
 *   JavaScript Object Literal using the TypeScript Factory.
 * - Optimized Overloading: Handles both "Registration" and "Validation"
 *   intents by intelligently managing function arguments.
 *
 * WHY:
 * - This satisfies Commandment II (Build-time Construction).
 * - It ensures that the runtime doesn't have to "think" or "calculate"—it
 *   just receives the pre-baked truth from the build.
 */
export function solidVisitorProcessor({
  node,
  shape,
  sourceFile,
  factory,
  key,
}: TSolidVisitorProcessor) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(),
  );

  const areaString = `${sourceFile.fileName}:${line + 1}:${character + 1}`;
  // const functionName = getFunctionName(node);
  // if (functionName === 'generateXalor') {
  //   const { key: resolvedKey, mode } = resolveGenerateXalorCall(node, checker);

  //   console.log(resolvedKey, mode, 'HERE');

  //   const metadata = createSolidMetadata({
  //     factory,
  //     areaString: mode ?? '',
  //     shape,
  //     key: resolvedKey ?? key,
  //   });

  //   const finalArgs =
  //     node.arguments.length === 0 ? [metadata] : [node.arguments[0], metadata];

  //   return factory.updateCallExpression(
  //     node,
  //     node.expression,
  //     node.typeArguments,
  //     finalArgs,
  //   );
  // }

  const metadata = createSolidMetadata({ factory, areaString, shape, key });
  const finalArgs =
    node.arguments.length === 0 ? [metadata] : [node.arguments[0], metadata];

  return factory.updateCallExpression(
    node,
    node.expression,
    node.typeArguments,
    finalArgs,
  );
}
/**


 */

//  function createSolidMetadata({
//   factory,
//   areaString,
//   key,
//   shape,
// }: TCreateSolidMetadata): ObjectLiteralExpression {
//   return factory.createObjectLiteralExpression([
//     /* prettier-ignore */ factory.createPropertyAssignment('key', factory.createStringLiteral(key)),
//     /* prettier-ignore */ factory.createPropertyAssignment('area',factory.createStringLiteral(areaString)),
//     /* prettier-ignore */ factory.createPropertyAssignment('version', factory.createStringLiteral(IS_SOLID_CONFIG_ITEMS.solidVersion)),
//     /* prettier-ignore */ factory.createPropertyAssignment('shape', generateShapeAST(factory, shape)),
//   ]);
// }
// /**
//  *
//  * ROLE:
//  * - The "Rewriter." It intercepts the ghost call and replaces it with a
//  *   high-performance runtime registration.
//  *
//  * STRATEGY:
//  * - Geometric Injection: Calculates the GPS coordinate (line:char) at the
//  *   last possible second to ensure pinpoint accuracy for the Auditor.
//  * - AST Reification: Converts the JSON "Solid Shape" into a physical
//  *   JavaScript Object Literal using the TypeScript Factory.
//  * - Optimized Overloading: Handles both "Registration" and "Validation"
//  *   intents by intelligently managing function arguments.
//  *
//  * WHY:
//  * - This satisfies Commandment II (Build-time Construction).
//  * - It ensures that the runtime doesn't have to "think" or "calculate"—it
//  *   just receives the pre-baked truth from the build.
//  */
// export function solidVisitorProcessor({
//   node,
//   shape,
//   sourceFile,
//   factory,
//   key,
// }: TSolidVisitorProcessor) {
//   const { line, character } = sourceFile.getLineAndCharacterOfPosition(
//     node.getStart(),
//   );
//   const areaString = `${sourceFile.fileName}:${line + 1}:${character + 1}`;
//   const metadata = createSolidMetadata({ factory, areaString, shape, key });
//   const finalArgs =
//     node.arguments.length === 0 ? [metadata] : [node.arguments[0], metadata];

//   return factory.updateCallExpression(
//     node,
//     node.expression,
//     node.typeArguments,
//     finalArgs,
//   );
// }
