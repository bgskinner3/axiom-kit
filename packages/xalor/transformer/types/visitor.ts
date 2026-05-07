import type {
  TypeChecker,
  CallExpression,
  NodeFactory,
  SourceFile,
  Type,
} from 'typescript';
import type { TSolidShape } from '../../src/models/types/shared';
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

/**
 * Encapsulates the context needed for the recursive structural expansion
 * of TypeScript types. By bundling the Type, Checker, and the current
 * AST Node, the printer can safely resolve symbols and types within
 * their original lexical scope without 'any' casting.
 */
export type TUpdateRegistry = {
  registry: Map<string, string>;
  key: string;
  filePath?: string;
  symbolName: string;
  typeName: string;
};

/**
 * Encapsulates the context needed for the recursive structural expansion
 * of TypeScript types. By bundling the Type, Checker, and the current
 * AST Node, the printer can safely resolve symbols and types within
 * their original lexical scope without 'any' casting.
 */
export type TPrintGhostStructure = {
  type: Type;
  checker: TypeChecker;
  node: Node;
};
