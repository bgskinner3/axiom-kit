import type { TGenerateXalorModes } from './triggers';

// ====================================================================
//  RAW BUILD-TIME EXTRACTOR PAYLOAD CONTRACTS
//
// These types represent the raw data extracted by the transformer's individual
// AST sniffers before they are normalized into full compiler type structures.
// They must consist ONLY of environment-agnostic primitive values.
// ====================================================================

/**
 *  RAW REGISTRATION PAYLOAD
 *
 * ROLE:
 * Governs the data emitted when parsing manual registration hooks.
 *
 * PATTERN TARGETED:
 * `registerXalor<'KEY', Type>()` or `registerXalor<'KEY'>(data)`
 *
 *  @see registerXalor api
 */
export type TRegisterRawPayload = {
  /** The unique lookup identification string extracted from generic slot 0 */
  readonly keyName: string;
} | null;

/**
 *  RAW GENERATION PAYLOAD
 *
 * ROLE:
 * Governs the data emitted when parsing operational invocation hooks.
 *
 * PATTERN TARGETED:
 * `generateXalor<'KEY', 'mode'>(optionalData)`
 *
 * @see generateXalor
 */
export type TGenerateRawPayload = {
  /** The target type graph identity key extracted from generic slot 0 */
  readonly key: string | undefined;
  /** The operational behavior directive extracted from generic slot 1 */
  readonly mode: TGenerateXalorModes | undefined;
};
