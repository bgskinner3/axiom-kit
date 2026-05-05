// transformer/visitor/detector.ts
import type { TypeChecker, CallExpression } from 'typescript';

type TIdentifySolidCall = {
  node: CallExpression;
  checker: TypeChecker;
};

export function identifySolidCall({ node, checker }: TIdentifySolidCall) {
  const typeArgs = node.typeArguments;
  if (typeArgs && typeArgs.length >= 2) {
    const keyNode = typeArgs[0];
    const shapeNode = typeArgs[1];

    const keyType = checker.getTypeFromTypeNode(keyNode);
    const shapeType = checker.getTypeFromTypeNode(shapeNode);
    return {
      keyType,
      shapeType,
    };
  }
  return {
    keyType: checker.getUnknownType(),
    shapeType: checker.getUnknownType(),
  };
}
// export function identifySolidCall(node: Node) {
//   if (!isSolidCall(node)) return null;

//   const typeArgs = node.typeArguments;
//   if (!typeArgs || typeArgs.length < 2) return null;

//   return {
//     keyNode: typeArgs[0],
//     typeNode: typeArgs[1],
//   };
// }
/**
     if (isSolidCall(node)) {
      const typeArgs = node.typeArguments;

      // 2. Ensure we have <Key, Type>
      if (typeArgs && typeArgs.length >= 2) {
        const keyNode = typeArgs[0];
        const shapeNode = typeArgs[1];

        const keyType = checker.getTypeFromTypeNode(keyNode);
        const shapeType = checker.getTypeFromTypeNode(shapeNode);
 */
