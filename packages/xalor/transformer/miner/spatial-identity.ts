// transformer/miner/ghost-structures.ts
import ts from 'typescript';
import { isTypeReference } from '../utils';
import type {
  TPrintGhostStructure,
  TSpatialIdentity,
  TInterfaceOrType,
} from '../types';

/**
 * ROLE:
 * - The "IntelliSense Engine." It converts complex TS Symbols into human-readable
 *   structural strings for the .d.ts Bridge (ISolidIdentity).
 *
 * STRATEGY:
 * - Recursively walks through Objects and Arrays to unwrap "Hidden" types.
 * - Prevents the "any" trap by leveraging bitwise TypeFlags.
 * - Handles the "Hydra Problem" (nested objects) by mapping properties to strings.
 *
 * WHY:
 * - Without this, your IDE would show [object Object].
 * - With this, your IDE shows the exact structural truth of the type.
 */
export function printGhostStructure({
  type,
  checker,
  node,
}: TPrintGhostStructure): string {
  if (checker.isArrayType(type) && isTypeReference(type)) {
    const typeArgs = checker.getTypeArguments(type);
    const itemType = typeArgs[0];

    const itemString = itemType
      ? printGhostStructure({ type: itemType, checker, node })
      : 'any';

    return `${itemString}[]`;
  }

  if (type.isClassOrInterface() || type.getFlags() & ts.TypeFlags.Object) {
    const props = checker.getPropertiesOfType(type);
    const propStrings = props.map((p) => {
      const pType = checker.getTypeOfSymbolAtLocation(p, node);
      const isOptional = p.getFlags() & ts.SymbolFlags.Optional ? '?' : '';
      const structure = pType
        ? printGhostStructure({ type: pType, checker, node })
        : 'any';

      return `${p.getName()}${isOptional}: ${structure};`;
    });
    return `{ ${propStrings.join(' ')} }`;
  }

  return checker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation);
}
/**
 * 🛰️ GET SPATIAL IDENTITY (The GPS)
 *
 * ROLE:
 * - The "Identity Constructor." It maps a transient TypeScript symbol to a
 *   permanent, multi-dimensional physical record.
 *
 * STRATEGY:
 * - DUAL-TRACKING: Captures the 'area' (GPS coordinate for the Auditor) AND
 *   the 'typeName' (Nominal link for the IDE Bridge) simultaneously.
 * - EXPORT VALIDATION: Checks the source file symbol to determine if a type
 *   is public-facing or internal, setting the 'symbolName' accordingly.
 *
 * WHY:
 * - This provides the Triple-KV Vault with everything it needs in one shot.
 * - It bridges the gap between where a type "lives" (file) and where it
 *   "occurs" (line/char).
 */
export function getSpatialIdentity({
  node,
  sourceFile,
  shapeType,
  checker,
}: TInterfaceOrType): TSpatialIdentity {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(),
  );
  const area = `${sourceFile.fileName}:${line + 1}:${character + 1}`;

  const typeName = printGhostStructure({ type: shapeType, checker, node });

  const symbol = shapeType.aliasSymbol || shapeType.getSymbol();
  let symbolName = 'unknown';

  if (symbol) {
    const name = symbol.getName();
    const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile);
    const isExported = !!sourceFileSymbol?.exports?.has(symbol.escapedName);
    symbolName = isExported ? name : 'unknown';
  }

  return {
    area,
    typeName,
    symbolName,
    filePath: sourceFile.fileName,
  };
}
