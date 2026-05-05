import type { TSolidShape } from '../../../models';

// export const isValidatorKind = <K extends TSolidShapeKinds>(
//   shape: TSolidShape,
//   kind: K,
// ): shape is Extract<TSolidShape, { kind: K }> => {
//   return shape.kind === kind;
// };
/* prettier-ignore */ export const isPrimitiveShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'primitive' }> => s.kind === 'primitive';
/* prettier-ignore */ export const isLiteralShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'literal' }> => s.kind === 'literal';
/* prettier-ignore */ export const isUnionShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'union' }> => s.kind === 'union';
/* prettier-ignore */ export const isObjectShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'object' }> => s.kind === 'object';
/* prettier-ignore */ export const isArrayShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'array' }> => s.kind === 'array';
/* prettier-ignore */ export const isBrandedShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'branded' }> => s.kind === 'branded';
/* prettier-ignore */ export const isIntersectionShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'intersection' }> => s.kind === 'intersection';
/* prettier-ignore */ export const isReferenceShape = (s: TSolidShape): s is Extract<TSolidShape, { kind: 'reference' }> => s.kind === 'reference';
