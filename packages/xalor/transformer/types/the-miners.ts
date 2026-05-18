import type {
  TypeChecker,
  SourceFile,
  Type,
  Node,
  Program,
  TransformationContext,
} from 'typescript';
import type { TSolidShape, TVaultSyncPayload } from '../../shared';

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

export type TSpatialIdentity = {
  readonly area: string; // GPS: "src/user.ts:42:10" (Auditor)
  readonly typeName: string; // Ghost: "import('...').User" (Bridge)
  readonly symbolName: string; // Identity: "User" (Registry)
  readonly filePath: string; // Absolute: "/project/src/user.ts" (File System)
};

export type TInterfaceOrType = {
  sourceFile: SourceFile;
  shapeType: Type;
  checker: TypeChecker;
  node: Node;
};

export type TSyncVaultParams = {
  registry: Map<string, TVaultSyncPayload>;
  payload: TVaultSyncPayload;
};

export type TMinerCorParams = {
  program: Program;
  context: TransformationContext;
  sourceFile: SourceFile;
  globalRegistry: Map<string, TVaultSyncPayload>;
  sessionRegistry: Map<string, string>;
};
export type TFlushToRegistryParams = {
  key: string;
  /** The reified JSON blueprint */
  shape: TSolidShape;
  /** The GPS and Symbol metadata captured by the Harvester */
  identity: TSpatialIdentity;
  /** Map of chopped fragments created during Atomic Cutting */
  fragments: Map<string, TSolidShape>;
  /** The shared session registry for the Bunker sync */
  globalRegistry: Map<string, TVaultSyncPayload>;
  /** The physical source file being mined */
  sourceFile: SourceFile;
};
