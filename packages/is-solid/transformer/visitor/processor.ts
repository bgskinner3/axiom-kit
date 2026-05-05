// transformer/visitor/processor.ts
import type {
  NodeFactory,
  ObjectLiteralExpression,
  CallExpression,
  SourceFile,
} from 'typescript';
import { generateShapeAST } from '../reifiers';
import type { TSolidShape } from '../../models/types';
type TCreateSolidMetadata = {
  shape: TSolidShape;
  factory: NodeFactory;
  key: string;
  areaString: string;
};
function createSolidMetadata({
  factory,
  areaString,
  key,
  shape,
}: TCreateSolidMetadata): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression([
    /* prettier-ignore */ factory.createPropertyAssignment('key', factory.createStringLiteral(key)),
    /* prettier-ignore */ factory.createPropertyAssignment('area',factory.createStringLiteral(areaString)),
    /* prettier-ignore */ factory.createPropertyAssignment('shape', generateShapeAST(factory, shape)),
  ]);
}
type TSolidVisitorProcessor = {
  node: CallExpression;
  shape: TSolidShape;
  sourceFile: SourceFile;
  factory: NodeFactory;
  key: string;
};
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
    node.typeArguments,
    finalArgs,
  );
}
// function createSolidMetadata(
//   f: NodeFactory,
//   key: string,
//   area: string,
//   shapeAST: Expression,
// ): ObjectLiteralExpression {
//   return factory.createObjectLiteralExpression([
//     f.createPropertyAssignment('key', f.createStringLiteral(key)),
//     f.createPropertyAssignment('area', f.createStringLiteral(area)),
//     f.createPropertyAssignment('shape', shapeAST),
//   ]);
// }
