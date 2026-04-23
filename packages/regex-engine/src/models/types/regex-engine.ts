import { REGEX_CENTRAL_PATTERN_SOURCE } from '../regex-patterns';
import type { TBranded } from './brand';
/**
 * Represents a set of descriptors that can be applied to a class via Object.defineProperties.
 * Each property is a lazy-loading, memoizing RegExp.
 */
export type TRegexRegistry<T> = {
  readonly [K in keyof T]: PropertyDescriptor & { get: () => RegExp };
};

export type TRegexPatternKeys = keyof typeof REGEX_CENTRAL_PATTERN_SOURCE;

export type TRegexRegistryInstance = {
  [K in TRegexPatternKeys]: TBranded<string, K>;
};
