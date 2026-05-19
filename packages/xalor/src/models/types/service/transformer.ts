import type { TSolidShape } from '../../../../shared';
/**
 * TTransformPickAndOmit
 *
 * Params for service XalethorVaultTransformer
 */
export type TTransformPredicate = (
  key: string,
  propertiesSet: Set<string>,
) => boolean;
export type TTransformPickAndOmit = {
  data: unknown;
  shape: TSolidShape;
  filterSet: Set<string>;
  predicate: TTransformPredicate;
};
export type TSanitizePickOmitTransformBase = {
  val: unknown;
  currentShape: TSolidShape;
  set: Set<string>;
  depth: number;
};
export type TSanitizeSlicedObject = {
  readonly currentShape: Extract<TSolidShape, { kind: 'object' }>;
  readonly seenObjectsMap: Map<unknown, unknown>;
  readonly predicate: TTransformPredicate;
} & TSanitizePickOmitTransformBase;

export type TSanitizePickOmit = {
  readonly seenObjectsMap: Map<unknown, unknown>;
  readonly predicate: TTransformPredicate;
} & TSanitizePickOmitTransformBase;
// TSanitizePickOmitTransform & {
// readonly currentShape: Extract<TSolidShape, { kind: 'object' }>;
// readonly seenObjectsMap: Map<unknown, unknown>;
// readonly predicate: (key: string, propertiesSet: Set<string>) => boolean;
//   }
// TSanitizePickOmitTransform & {
// readonly seenObjectsMap: Map<unknown, unknown>;
// readonly predicate: (key: string, propertiesSet: Set<string>) => boolean;
//   }
