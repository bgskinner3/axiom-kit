import type { TSolidShape } from './core';
// These allow you to type-gate your sub-validator functions
/* prettier-ignore */ export type TSolidPrimitiveShape = Extract<TSolidShape, { kind: 'primitive' }>;
/* prettier-ignore */ export type TSolidLiteralShape   = Extract<TSolidShape, { kind: 'literal' }>;
/* prettier-ignore */ export type TSolidUnionShape     = Extract<TSolidShape, { kind: 'union' }>;
/* prettier-ignore */ export type TSolidObjectShape    = Extract<TSolidShape, { kind: 'object' }>;
/* prettier-ignore */ export type TSolidArrayShape     = Extract<TSolidShape, { kind: 'array' }>;
/* prettier-ignore */ export type TSolidBrandedShape   = Extract<TSolidShape, { kind: 'branded' }>;
/* prettier-ignore */ export type TSolidIntersectionShape = Extract<TSolidShape, { kind: 'intersection' }>;
/* prettier-ignore */ export type TSolidReferenceShape = Extract<TSolidShape, { kind: 'reference' }>;
