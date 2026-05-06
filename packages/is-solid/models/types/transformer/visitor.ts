import type {
  TypeChecker,
  CallExpression,
  NodeFactory,
  SourceFile,
} from 'typescript';

/**
 * TYPE: TIdentifySolidCall
 *
 * Extracts and resolves Type Arguments from an active CallExpression.
 */
export type TIdentifySolidCall = {
  node: CallExpression;
  checker: TypeChecker;
};
/**
 * TYPE: TCreateSolidMetadata
 *
 * Arguments for generating the runtime Metadata ObjectLiteral during transformation.
 */
export type TCreateSolidMetadata = {
  shape: TSolidShape;
  factory: NodeFactory;
  key: string;
  areaString: string;
};
/**
 * TYPE: TSolidVisitorProcessor
 *
 * Context required to rewrite a Node and inject metadata into the AST.
 */
export type TSolidVisitorProcessor = {
  node: CallExpression;
  shape: TSolidShape;
  sourceFile: SourceFile;
  factory: NodeFactory;
  key: string;
};
