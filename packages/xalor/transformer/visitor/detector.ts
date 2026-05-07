// transformer/visitor/detector.ts
import type { TIdentifySolidCall } from '../types';

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
