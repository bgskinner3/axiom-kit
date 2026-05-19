// shared/types/api-contracts/triggers.ts
import {
  SENTRY_TRIGGER_NAMES,
  GENERATOR_MODE_TRIGGERS,
  VALIDATION_MODE_TRIGGERS,
  TRANSFORM_MODE_TRIGGERS,
} from '../../constants';

/**
 * API TRIGGER NAMES UNION
 *
 * ROLE:
 * Converts the master configuration array into a strict TypeScript type union.
 *
 * APPLICATION:
 * - Build-Time: Used by `getAPIName()` to ensure AST candidate calls exactly match
 *   recognized system functions ('registerXalor' | 'generateXalor').
 * - Runtime: Drives the shared identification metrics across internal tracking setups.
 */
export type TSentryTriggerName = (typeof SENTRY_TRIGGER_NAMES)[number];
/**
 * DYNAMIC GENERATION MODE UNION
 *
 * ROLE:
 * Automatically derives permissible execution behaviors from the frozen constants registry.
 *
 * APPLICATION:
 * - Build-Time: Dictates what modes the target extractor router can read from generic slots.
 * - Runtime: Constrains autocomplete options for the developer and secures the
 *   polymorphic `GENERATOR_MODES` handler map inside `generateXalor`.
 */
export type TGenerateXalorModes = (typeof GENERATOR_MODE_TRIGGERS)[number];

/**
 * 🎛️ DYNAMIC VALIDATION MODE UNION
 *
 * ROLE:
 * Automatically derives permissible verification strategies from the frozen validation constants registry.
 *
 * APPLICATION:
 * - Build-Time: Governs valid execution types extracted from AST generic parameters during compilation.
 * - Runtime: Drives autocomplete options for defensive inline gates and secures the
 *   polymorphic `VALIDATOR_MODES` strategy engine inside `validateXalor`.
 */
export type TValidateXalorModes = (typeof VALIDATION_MODE_TRIGGERS)[number];

/**
 * 🧬 DYNAMIC TRANSFORM MODE UNION
 *
 * ROLE:
 * Automatically derives permissible structural mutation behaviors from the frozen transform constants registry.
 *
 * APPLICATION:
 * - Build-Time: Outlines the transformation modifiers the AST sniffer is permitted to map from generic slots.
 * - Runtime: Locks down autocomplete parameters for data mapping pipelines and secures the
 *   polymorphic `TRANSFORMATION_MODES` strategy engine inside `transformXalor`.
 */
export type TTransformXalorModes = (typeof TRANSFORM_MODE_TRIGGERS)[number];
