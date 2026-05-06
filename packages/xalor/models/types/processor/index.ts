import type { TSolidShape, TSolidError } from '../../types';
export type TValidationContext = {
  // Map of data objects to the shape they were validated against
  seen: Map<unknown, Set<TSolidShape>>;
  // Path for error reporting (e.g., "user.profile.id")
  path: string;
  errors: TSolidError[];
  // ✨ Keep track of the current Key for error indexing
  currentKey?: string;
};

export type TValidatorFn = (
  data: unknown,
  shape: TSolidShape,
  ctx: TValidationContext,
) => boolean;

export type TValidatorMapper = { [K in TSolidShape['kind']]: TValidatorFn };
export type TGetCallerLocationOptions = {
  preferredIndex?: number;
  /** Fallback index if preferredIndex is not available (default: 2) */
  fallbackIndex?: number;
  /** Whether to get the top-level parent function instead of preferredIndex (default: false) */
  topParent?: boolean;
  /** Path prefix to strip from the returned line (default: process.cwd()) */
  stripPathPrefix?: string;
};
