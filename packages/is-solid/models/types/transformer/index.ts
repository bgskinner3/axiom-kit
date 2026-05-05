// models/types/transformer
import type { Type } from 'typescript';
export type TSolidShapeKinds =
  | 'primitive'
  | 'literal'
  | 'union'
  | 'intersection'
  | 'branded'
  | 'object'
  | 'array'
  | 'reference';
/**
 * The strict discriminated union for all reified type shapes.
 * This is the "Blueprint" for your Type Database.
 */
export type TSolidShape =
  | /* prettier-ignore */ { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'bigint' | 'unknown'; }
  | /* prettier-ignore */ { kind: 'literal'; value: string | number | boolean }
  | /* prettier-ignore */ { kind: 'union'; values: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'intersection'; parts: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'branded'; name: string; base: TSolidShape }
  | /* prettier-ignore */ { kind: 'object'; properties: Record<string, TSolidShape> }
  | /* prettier-ignore */ { kind: 'array'; items: TSolidShape }
  | /* prettier-ignore */ { kind: 'reference'; name: string };

/**
 * The context passed through reifiers to handle recursion and lookups.
 */
export type TReifierContext = {
  checker: import('typescript').TypeChecker;
  seen: Set<Type>;
};
