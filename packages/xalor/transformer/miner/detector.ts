// transformer/miner/detector.ts
import type { TIdentifySolidCall } from '../types';
/**
 *
 * ROLE:
 * - The "Type Harvester." It isolates the generic <K, T> pair from the call-site
 *   and converts them into live TypeScript Type objects.
 *
 * STRATEGY:
 * - Direct Generic Mapping: Slots [0] for the Key, Slot [1] for the Shape.
 * - Defensive Resolution: If the generic is missing or malformed, it returns
 *   an "Unknown" type to prevent the Miner from crashing (Commandment IV).
 *
 * WHY:
 * - This is the official bridge between the User's Intent (the code they wrote)
 *   and the Miner's Logic (the data we extract).
 */
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
