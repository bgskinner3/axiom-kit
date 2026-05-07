import {
  Type,
  Node,
  TypeChecker,
  TypeFlags,
  SymbolFlags,
  TypeFormatFlags,
} from 'typescript';
import { isTypeReference } from '../utils';
type TPrintGhostStructure = {
  type: Type;
  checker: TypeChecker;
  node: Node;
};
/**
 * 🛰️ GHOST PRINTER
 *
 * Recursively expands TypeScript types into structural strings.
 * Uses native TypeChecker guards to avoid 'any' casting.
 */
export function printGhostStructure({
  type,
  checker,
  node,
}: TPrintGhostStructure): string {
  // 1. Arrays (Recursive)
  /* prettier-ignore */ if (checker.isArrayType(type) && isTypeReference(type)) {
  
    const typeArgs = checker.getTypeArguments(type);
    const itemType = typeArgs[0];
    
    const itemString = itemType 
      ? printGhostStructure({ type: itemType, checker, node }) 
      : 'any';
      
    return `${itemString}[]`;
  }

  // 2. Objects / Interfaces (Structural Expansion)
  /* prettier-ignore */ if (type.isClassOrInterface() || (type.getFlags() & TypeFlags.Object)) {
    const props = checker.getPropertiesOfType(type);
    const propStrings = props.map((p) => {
      const pType = checker.getTypeOfSymbolAtLocation(p, node);
      const isOptional = p.getFlags() & SymbolFlags.Optional ? '?' : '';
      // Recursion: Allows for deeply nested { a: { b: { c: string } } }
      const structure = pType 
        ? printGhostStructure({ type: pType, checker, node }) 
        : 'any';
        
      return `${p.getName()}${isOptional}: ${structure};`;
    });
    return `{ ${propStrings.join(' ')} }`;
  }

  // 3. Fallback for primitives
  /* prettier-ignore */ return checker.typeToString(type, node, TypeFormatFlags.NoTruncation);
}
