import type {
  Type,
  StringLiteralType,
  NumberLiteralType,
  UnionType,
  IntersectionType,
  ObjectType,
  TypeReference,
} from 'typescript';
import { TypeFlags, ObjectFlags } from 'typescript';

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
  return !!(type.getFlags() & TypeFlags.Object);
}

/**
 * Checks if a type is a Reference (like Array<T> or a specific Branded Type)
 */
export function isTypeReference(type: Type): type is TypeReference {
  // 1. Check if it's an object first
  if (type.getFlags() & TypeFlags.Object) {
    if (!isObjectType(type)) return false;
    const objectType = type;
    // 3. Check for Reference bit directly
    return (objectType.objectFlags & ObjectFlags.Reference) !== 0;
  }
  return false;
}
