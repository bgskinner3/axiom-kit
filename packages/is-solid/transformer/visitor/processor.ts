// transformer/visitor/processor.ts
import type { ObjectLiteralExpression } from 'typescript';
import { generateShapeAST } from '../reifiers';
import { IS_SOLID_CONFIG_ITEMS } from '../../models/constants';
import type {
  TCreateSolidMetadata,
  TSolidVisitorProcessor,
} from '../../models/types';

function createSolidMetadata({
  factory,
  areaString,
  key,
  shape,
}: TCreateSolidMetadata): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression([
    /* prettier-ignore */ factory.createPropertyAssignment('key', factory.createStringLiteral(key)),
    /* prettier-ignore */ factory.createPropertyAssignment('area',factory.createStringLiteral(areaString)),
    /* prettier-ignore */ factory.createPropertyAssignment('version', factory.createStringLiteral(IS_SOLID_CONFIG_ITEMS.solidVersion)),
    /* prettier-ignore */ factory.createPropertyAssignment('shape', generateShapeAST(factory, shape)),
  ]);
}

export function solidVisitorProcessor({
  node,
  shape,
  sourceFile,
  factory,
  key,
}: TSolidVisitorProcessor) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(),
  );
  const areaString = `${sourceFile.fileName}:${line + 1}:${character + 1}`;
  const metadata = createSolidMetadata({ factory, areaString, shape, key });
  const finalArgs =
    node.arguments.length === 0
      ? [factory.createIdentifier('undefined'), metadata]
      : [node.arguments[0], metadata];

  return factory.updateCallExpression(
    node,
    node.expression,
    // node.typeArguments,
    undefined,
    finalArgs,
  );
}
