import ts from 'typescript';
import { XALOR_MINING_ROUTER_MAPPER } from './mappers';
import { getAPIName } from '../utils';
import type { TResolvedMiningRouterReturn } from '../types';
/**
 * # RESOLVE MINING TARGET
 *
 * ROLE:
 * Master entry point that intercepts active AST nodes and evaluates them safely.
 *
 * STRATEGY:
 * Avoids complex loop structures by routing the apiName directly to your flat blocks.
 */
export function resolveMiningTarget(
  node: ts.Node,
  checker: ts.TypeChecker,
): TResolvedMiningRouterReturn {
  if (!ts.isCallExpression(node)) return null;

  // 1. Instantly extract whether this is registerXalor or generateXalor
  const apiName = getAPIName(node);

  // 2. Clear block branches evaluate your maps with total type safety
  if (apiName === 'registerXalor') {
    return XALOR_MINING_ROUTER_MAPPER.registerXalor(node, checker);
  }

  if (apiName === 'generateXalor') {
    return XALOR_MINING_ROUTER_MAPPER.generateXalor(node, checker);
  }
  if (apiName === 'validateXalor') {
    return XALOR_MINING_ROUTER_MAPPER.validateXalor(node, checker);
  }
  return null;
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
 *
 *
 *
 * ORIGINAL
 */
// import type { Node } from 'typescript';
// import ts from 'typescript';
// // import { getAPIName } from '../utils';
// // import { SENTRY_TRIGGER_NAMES } from '../../shared';
// /**
//  * RESOLVE MINING TARGET
//  *
//  * ROLE:
//  * The "Switchboard." It determines the extraction strategy based on the
//  * call signature of 'registerXalor'.
//  *
//  * STRATEGY:
//  * - Path A (Static): Extracts the 'Key' and 'Type' directly from generic slots.
//  * - Path B (Dynamic): Extracts the 'Key' from generics, but sniffs the 'Type'
//  *   from the physical JavaScript argument using the TypeChecker.
//  *
//  * WHY:
//  * This allows Xalor to support both declarative interface registration
//  * and "on-the-fly" registration of existing data objects.
//  *
//  * @see registerXalor
//  */
// export function resolveMiningTarget(node: Node, checker: ts.TypeChecker) {
//   if (!ts.isCallExpression(node)) return null;
//   // const name = getAPIName(node);

//   const typeArgs = node.typeArguments;
//   const args = node.arguments;

//   // --- PATH A: <'KEY', Type>() ---
//   if (typeArgs && typeArgs.length >= 2) {
//     const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
//     const shapeType = checker.getTypeFromTypeNode(typeArgs[1]);

//     // 🎯 THE FIX: Ensure we extract the physical string value
//     if (!keyType.isStringLiteral()) return null;

//     return {
//       keyName: keyType.value,
//       keyType,
//       shapeType,
//     };
//   }

//   // --- PATH B: <'KEY'>(data) ---
//   if (typeArgs && typeArgs.length === 1 && args.length >= 1) {
//     const keyType = checker.getTypeFromTypeNode(typeArgs[0]);
//     const shapeType = checker.getTypeAtLocation(args[0]);

//     if (!keyType.isStringLiteral()) return null;

//     return {
//       keyName: keyType.value, // This is the physical string
//       keyType,
//       shapeType,
//     };
//   }

//   return null;
// }
