// models/guards/transformer/types.ts
import type {
  Type,
  StringLiteralType,
  NumberLiteralType,
  UnionType,
  IntersectionType,
  ObjectType,
  TypeReference,
} from 'typescript';
import ts from 'typescript';

export function isStringLiteralType(type: Type): type is StringLiteralType {
  return type.isStringLiteral();
}

export function isNumberLiteralType(type: Type): type is NumberLiteralType {
  return type.isNumberLiteral();
}

export function isUnionType(type: Type): type is UnionType {
  return type.isUnion();
}

export function isIntersectionType(type: Type): type is IntersectionType {
  return type.isIntersection();
}

/**
 * Guard for Object types (Interface, Class, Literal)
 */
export function isObjectType(type: Type): type is ObjectType {
  return !!(type.getFlags() & ts.TypeFlags.Object);
}

/**
 * Checks if a type is a Reference (like Array<T> or a specific Branded Type)
 */
export function isTypeReference(type: Type): type is TypeReference {
  if (type.getFlags() & ts.TypeFlags.Object) {
    if (!isObjectType(type)) return false;
    const objectType = type;
    return (objectType.objectFlags & ts.ObjectFlags.Reference) !== 0;
  }
  return false;
}
