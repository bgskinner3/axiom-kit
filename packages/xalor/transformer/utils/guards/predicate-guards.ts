import type {
  TResolvedMiningRouterReturn,
  TRegisterRawPayload,
  TGenerateRawPayload,
  TValidateRawPayload,
  TTransformerRawPayload,
} from '../../types';

// ========================================================================
// TYPE PREDICATE GUARDS (Satisfies Main Miner Loop Safety)
// ========================================================================

/**
 * 🛡️ IS REGISTRATION TARGET TYPE GUARD
 * Verifies if an extracted target payload belongs to a type-producing registration node.
 */
export function isRegisterTarget(
  target: TResolvedMiningRouterReturn | null,
): target is TRegisterRawPayload {
  return target !== null && target.apiName === 'registerXalor';
}

/**
 * 🛡️ IS GENERATION TARGET TYPE GUARD
 * Verifies if an extracted target payload belongs to a type-consuming generation node.
 */
export function isGenerateTarget(
  target: TResolvedMiningRouterReturn | null,
): target is TGenerateRawPayload {
  return target !== null && target.apiName === 'generateXalor';
}

/** IS VALIDATION TARGET TYPE GUARD */
export function isValidateTarget(
  target: TResolvedMiningRouterReturn,
): target is TValidateRawPayload {
  return target !== null && target.apiName === 'validateXalor';
}

/** IS Transformer TARGET TYPE GUARD */
export function isTransformerTarget(
  target: TResolvedMiningRouterReturn,
): target is TTransformerRawPayload {
  return target !== null && target.apiName === 'transformXalor';
}
