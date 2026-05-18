// transformer/miner/processor.ts
import type { CallExpression, Expression } from 'typescript';
import type { TProcessorTarget } from '../types';
import { PROCESSOR_REWRITE_MAPPER } from './mappers';
import { isGenerateTarget, isRegisterTarget } from '../utils';
/**
 * SOLID VISITOR PROCESSOR (The AST Synthesizer)
 *
 * ROLE:
 * The primary mechanical rewriter of the Xalor compilation engine. It intercepts
 * transient TypeScript call expressions at build time and mutates their argument
 * signatures into explicit, pre-baked runtime configurations.
 *
 * STRATEGY:
 * Uses a strict Discriminated Union interface model (`TProcessorTarget`). By channeling
 * properties through closed type predicates (`isRegisterTarget`, `isGenerateTarget`),
 * it forces complete execution branch isolation. This allows producers to inject deep
 * structural graphs and consumer hooks to map metadata strings seamlessly, entirely
 * neutralizing procedural switch statements or unsafe type overrides.
 *
 * WHY:
 * Satisfies Commandment II (Build-Time Construction Rule) and Commandment IV
 * (Operation Isolation). It pre-bakes structural truths directly into the final
 * compiled application code blocks so that the live execution thread remains completely
 * zero-allocation and never has to parse types manually at runtime.
 */
export function solidVisitorProcessor({
  node,
  sourceFile,
  factory,
  target,
  shape,
}: TProcessorTarget): CallExpression {
  let finalArgs: Expression[] = [];

  if (isRegisterTarget(target)) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(),
    );
    const areaString = `${sourceFile.fileName}:${line + 1}:${character + 1}`;

    /* prettier-ignore */ finalArgs = PROCESSOR_REWRITE_MAPPER.registerXalor( target, node, factory, areaString, shape,);
  }

  if (isGenerateTarget(target)) {
    /* prettier-ignore */ finalArgs = PROCESSOR_REWRITE_MAPPER.generateXalor(target, node, factory);
  }

  return factory.updateCallExpression(
    node,
    node.expression,
    node.typeArguments,
    finalArgs,
  );
}

// TODO: REMOVE
// ROGIANL

// export type TCreateSolidMetadata = {
//   shape: TSolidShape;
//   factory: NodeFactory;
//   key: string;
//   areaString: string;
// };
// export type TSolidVisitorProcessor = {
//   node: CallExpression;
//   shape: TSolidShape;
//   sourceFile: SourceFile;
//   factory: NodeFactory;
//   key: string;
// };
//  function createSolidMetadata({
//   factory,
//   areaString,
//   key,
//   shape,
// }: TCreateSolidMetadata): ObjectLiteralExpression {
//   return factory.createObjectLiteralExpression([
//     /* prettier-ignore */ factory.createPropertyAssignment('key', factory.createStringLiteral(key)),
//     /* prettier-ignore */ factory.createPropertyAssignment('area',factory.createStringLiteral(areaString)),
//     /* prettier-ignore */ factory.createPropertyAssignment('version', factory.createStringLiteral(IS_SOLID_CONFIG_ITEMS.solidVersion)),
//     /* prettier-ignore */ factory.createPropertyAssignment('shape', generateShapeAST(factory, shape)),
//   ]);
// }
// /**
//  *
//  * ROLE:
//  * - The "Rewriter." It intercepts the ghost call and replaces it with a
//  *   high-performance runtime registration.
//  *
//  * STRATEGY:
//  * - Geometric Injection: Calculates the GPS coordinate (line:char) at the
//  *   last possible second to ensure pinpoint accuracy for the Auditor.
//  * - AST Reification: Converts the JSON "Solid Shape" into a physical
//  *   JavaScript Object Literal using the TypeScript Factory.
//  * - Optimized Overloading: Handles both "Registration" and "Validation"
//  *   intents by intelligently managing function arguments.
//  *
//  * WHY:
//  * - This satisfies Commandment II (Build-time Construction).
//  * - It ensures that the runtime doesn't have to "think" or "calculate"—it
//  *   just receives the pre-baked truth from the build.
//  */
// export function solidVisitorProcessor({
//   node,
//   shape,
//   sourceFile,
//   factory,
//   key,
// }: TSolidVisitorProcessor) {
//   const { line, character } = sourceFile.getLineAndCharacterOfPosition(
//     node.getStart(),
//   );
//   const areaString = `${sourceFile.fileName}:${line + 1}:${character + 1}`;
//   const metadata = createSolidMetadata({ factory, areaString, shape, key });
//   const finalArgs =
//     node.arguments.length === 0 ? [metadata] : [node.arguments[0], metadata];

//   return factory.updateCallExpression(
//     node,
//     node.expression,
//     node.typeArguments,
//     finalArgs,
//   );
// }
