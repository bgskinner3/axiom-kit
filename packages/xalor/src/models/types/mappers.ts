import type {
  TSolidShape,
  TStrictSolidMetaData,
  TSolidMetadata,
  TValidationContext,
  TXalorRuleKind,
} from './shared';

/**
 * TSHAPE_DEFAULT_MATERIALIZE_MAP
 *
 * ROLE:
 * The static type-system contract for the "Materializer" map. It forces exhaustive,
 * zero-assertion functional wiring when constructing new values from blueprints.
 *
 * @see DEFAULT_SHAPE_MATERIALIZER
 * @see produceDefault
 */
export type TShapeDefaultMaterializeMap = {
  [K in TSolidShape['kind']]: (
    shape: Extract<TSolidShape, { kind: K }>,
    depth: number,
    recurse: (s: TSolidShape, d: number) => unknown,
  ) => unknown;
};

/**
 * TSHAPE_MOCK_MAPPER_MAP
 *
 * ROLE:
 * The static type-system contract for the "Simulacrum" map. It coordinates
 * execution formatting parameters for stochastic, constraint-aware random data arrays.
 *
 * @see MOCK_SHAPE_MATERIALIZER
 * @see produceMock
 */
export type TShapeMockMapperMap = {
  [K in TSolidShape['kind']]: (
    shape: Extract<TSolidShape, { kind: K }>,
    depth: number,
    recurse: (s: TSolidShape, d: number) => unknown,
  ) => unknown;
};
/**
 * TSHAPE_CLONE_MAPPER_MAP
 *
 * ROLE:
 * The static type-system contract for the "Sanitizer" map. It governs deep,
 * data-scrubbing operations to physically wash un-declared properties away.
 *
 * @see CLONE_SHAPE_SANITIZER
 * @see produceClone
 */
export type TShapeCloneMapperMap = {
  [K in TSolidShape['kind']]: (
    /* prettier-ignore */ shape: Extract<TSolidShape, { kind: K }>,
    /* prettier-ignore */ data: unknown,
    /* prettier-ignore */ seen: Map<unknown, unknown>,
    /* prettier-ignore */ depth: number,
    /* prettier-ignore */ recurse: (d: unknown, s: TSolidShape, seen: Map<unknown, unknown>, depth: number) => unknown,
  ) => unknown;
};
/**
 * TRectifierRegistryMapper
 *
 * ROLE:
 * The static type-system layout contract for the "Refiner" registry. It forces
 * exhaustive, compile-time verified mapping signatures when upgrading raw
 * metadata packets into high-definition, strict storage containers.
 *
 * @see RECTIFIER_REGISTRY
 * @see preRegisterMetadata
 * @see TStrictSolidMetaData
 */
export type TRectifierRegistryMapper = {
  readonly [K in keyof TStrictSolidMetaData]: (
    input: TSolidMetadata,
  ) => TStrictSolidMetaData[K];
};
/**
 * TSHAPE_NORMALIZER_MAPPER
 *
 * ROLE:
 * The static compiler-layer blueprint contract for the Banker Engine.
 * Drives build-time Content-Addressable Storage (CAS) shredding by forcing
 * exhaustive mapping routines to isolate, index, and deduplicate sub-properties.
 */
export type TShapeNormalizerMapper = {
  [K in TSolidShape['kind']]: (
    shape: Extract<TSolidShape, { kind: K }>,
    flatPool: Record<string, TSolidShape>,
    recurse: (s: TSolidShape, pool: Record<string, TSolidShape>) => TSolidShape,
  ) => TSolidShape;
};
/**
 * TSHAPE_INFLATOR_MAPPER
 *
 * ROLE:
 * The static database de-serialization contract for Stage 5 (Hydration).
 * Enforces strict dictionary compilation paths to expand content-addressable
 * pointer strings recursively into inline execution graphs in active RAM.
 */
export type TShapeInflatorMapper = {
  [K in TSolidShape['kind']]: (
    shape: Extract<TSolidShape, { kind: K }>,
    blueprintsPool: Record<string, TSolidShape>,
    recurse: (s: TSolidShape, pool: Record<string, TSolidShape>) => TSolidShape,
  ) => TSolidShape;
};
/**
 * T_VALIDATOR_MAPPER
 *
 * ROLE:
 * The static runtime constraint contract for Category 2 (Validation API).
 * Maps incoming physical JSON data types instantly to their matching
 * structural check signatures, guaranteeing sub-microsecond parsing traps.
 */
export type TValidatorMapper = {
  [K in TSolidShape['kind']]: (
    data: unknown,
    shape: TSolidShape,
    ctx: TValidationContext,
  ) => boolean;
};
/**
 * T_RULE_AUDITOR_MAPPER
 *
 * ROLE:
 * The static compiler-layer validation matrix schema for the Diagnostic Engine.
 * Enforces strict structural typing bounds on rule classification mappings,
 * ensuring dictionary arrays map token match buckets to concrete category enums.
 *
 * DESIGN:
 * Leverages a dual-tuple multi-dimensional readonly design format to enforce
 * static evaluation safety across deep parsing translation runs.
 */
export type TRuleAuditorMapper = readonly [readonly string[], TXalorRuleKind][];
