import { IS_SOLID_CONFIG_ITEMS } from '../../models/constants';
import type { TSolidShape } from '../../models/types';
import {
  DEFAULT_SHAPE_MATERIALIZER,
  MOCK_SHAPE_MATERIALIZER,
  CLONE_SHAPE_SANITIZER_MAPPER,
  CAST_SHAPE_MAPPER,
} from '../../mappers';
// TODO: add proper return type for mocks, default clones ...
/**
 *  PRODUCE Defualt
 *
 * ROLE:
 */
export function produceDefault(shape: TSolidShape, depth = 0): unknown {
  // 🛑 THE EMERGENCY BRAKE: Protects thread from cyclic execution crashes
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) return null;

  if (!shape) return undefined;

  // 🎯 THE TYPE-SAFE DISPATCHER
  // By capturing the layout kind as a specific generic K, TypeScript maps
  // the target shape constituent directly to the matching map function signature.
  const executeMaterializer = <K extends TSolidShape['kind']>(
    kind: K,
    targetShape: Extract<TSolidShape, { kind: K }>,
  ): unknown => {
    const materializer = DEFAULT_SHAPE_MATERIALIZER[kind];
    return materializer(targetShape, depth, produceDefault);
  };

  // Pass the shape kind and target payload straight into the generic runner.
  // This satisfies the compiler perfectly with 100% compile-time security.
  return executeMaterializer(shape.kind, shape);
}

/**
 * 🎲 PRODUCE MOCK
 *
 * ROLE:
 * Converts a static TSolidShape blueprint into a randomized, high-entropy
 * physical mock layout using a clean O(1) dictionary lookup map.
 *
 * LAW: Zero 'any', Zero type assertions ('as'), and Zero 'switch' blocks.
 */
export function produceMock(shape: TSolidShape, depth = 0): unknown {
  // 🛑 THE EMERGENCY BRAKE: Protects thread from cyclic execution crashes
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) return null;

  if (!shape) return undefined;

  // 🎯 THE TYPE-SAFE DISPATCHER
  // Captures the configuration kind as a distinct generic constituent K,
  // mapping the shape properties perfectly to the corresponding map worker function.
  const executeMockMaterializer = <K extends TSolidShape['kind']>(
    kind: K,
    targetShape: Extract<TSolidShape, { kind: K }>,
  ): unknown => {
    const normalizer = MOCK_SHAPE_MATERIALIZER[kind];
    return normalizer(targetShape, depth, produceMock);
  };

  return executeMockMaterializer(shape.kind, shape);
}
/**
 * 🧼 PRODUCE CLONE
 *
 * ROLE:
 * Performs a deep, circular-safe copy of an input object while
 * physically scrubbing away any keys missing from the TSolidShape blueprint.
 *
 * LAW: Zero 'any', Zero type assertions ('as'), and Zero 'switch' blocks.
 */
export function produceClone(
  data: unknown,
  shape: TSolidShape,
  seen = new Map<unknown, unknown>(),
  depth = 0,
): unknown {
  // ⚖️ THE DEPTH LAW (Security boundary check)
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) {
    return null;
  }

  // 🛡️ PRIMITIVE FAST CONTRACT
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // 🔄 IDENTITY PROTECTION: Intercept circular links instantly
  const cached = seen.get(data);
  if (cached !== undefined) {
    return cached;
  }

  if (!shape) return data;

  // 🎯 THE TYPE-SAFE DISPATCHER
  // Extracts the specific generic constituent K from the open union shape node
  // to coordinate execution straight to the correct dictionary worker.
  const executeCloneSanitizer = <K extends TSolidShape['kind']>(
    kind: K,
    targetShape: Extract<TSolidShape, { kind: K }>,
  ): unknown => {
    const sanitizer = CLONE_SHAPE_SANITIZER_MAPPER[kind];
    return sanitizer(targetShape, data, seen, depth, produceClone);
  };

  return executeCloneSanitizer(shape.kind, shape);
}
/**
 * 🧹 PRODUCE CAST
 *
 * ROLE:
 * Coerces loose runtime data values cleanly into the exact structural and
 * primitive types demanded by your type blueprint contracts.
 *
 * LAW: Zero 'any', Zero type assertions ('as'), and Zero 'switch' blocks.
 */
export function produceCast(
  shape: TSolidShape,
  data: unknown,
  depth = 0,
): unknown {
  // 🛑 THE EMERGENCY BRAKE: Protects execution threads from cyclic graph recursion crashes
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) {
    return data; // Safe fallback to raw loose input if depth threshold is blown
  }
  if (!shape) return data;

  // 🎯 THE TYPE-SAFE DISPATCHER
  // Captures the configuration kind as a distinct generic constituent K,
  // mapping parameters perfectly to the corresponding map worker function.
  const executeCastMaterializer = <K extends TSolidShape['kind']>(
    kind: K,
    targetShape: Extract<TSolidShape, { kind: K }>,
  ): unknown => {
    const caster = CAST_SHAPE_MAPPER[kind];
    return caster(targetShape, data, depth, produceCast);
  };

  return executeCastMaterializer(shape.kind, shape);
}
