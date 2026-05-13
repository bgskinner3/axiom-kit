import type {
  TSolidShape,
  TStrictSolidMetaData,
  TSolidMetadata,
} from '../types';

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
