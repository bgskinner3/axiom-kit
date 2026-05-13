import type { TVaultSyncPayload, TSolidShape } from './shared';

export type TPersistParams = {
  rootDir: string;
  registry: Map<string, TVaultSyncPayload>;
};

export type TShapeNormalizerMap = {
  [K in TSolidShape['kind']]: (
    shape: Extract<TSolidShape, { kind: K }>,
    flatPool: Record<string, TSolidShape>,
    recurse: (s: TSolidShape, pool: Record<string, TSolidShape>) => TSolidShape,
  ) => TSolidShape;
};
export type TShapeInflatorMap = {
  [K in TSolidShape['kind']]: (
    shape: Extract<TSolidShape, { kind: K }>,
    blueprintsPool: Record<string, TSolidShape>,
    recurse: (s: TSolidShape, pool: Record<string, TSolidShape>) => TSolidShape,
  ) => TSolidShape;
};
