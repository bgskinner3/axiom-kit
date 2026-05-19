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
  if (apiName === 'registerXalor')
    return XALOR_MINING_ROUTER_MAPPER.registerXalor(node, checker);
  if (apiName === 'generateXalor')
    return XALOR_MINING_ROUTER_MAPPER.generateXalor(node, checker);
  if (apiName === 'validateXalor')
    return XALOR_MINING_ROUTER_MAPPER.validateXalor(node, checker);
  if (apiName === 'transformXalor')
    return XALOR_MINING_ROUTER_MAPPER.transformXalor(node, checker);

  return null;
}
