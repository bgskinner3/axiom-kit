import ts from 'typescript';
import { createVisitor } from '../../transformer/visitor';
import { UTIL_CONFIG_OPTIONS } from './constants';

/**
 * mineTransformation
 *
 * THE VIRTUAL TRANSFORMER SIMULATOR
 *
 * This utility serves as the high-level integration test runner for the
 * 'xalor' transformer. It simulates a real TypeScript compilation cycle
 * within an in-memory virtual environment.
 * -------------------------
 *
 *  PROCESS:
 * 1. PROGRAM BOOTSTRAP: Initializes a full TypeScript Program using a
 *    Virtual Compiler Host, allowing real library types (like 'number') to resolve.
 * 2. SYMBOL BINDING: Forcefully runs semantic diagnostics to link identifiers
 *    across your test string (e.g., linking a 'type' declaration to its usage).
 * 3. VISITOR EXECUTION: Triggers the 'createVisitor' loop to scan the AST for
 *    'isSolid' calls, mine the metadata, and update the global registry.
 * 4. CODE EMISSION: Uses the Printer to output the final transformed JavaScript,
 *    including the injected metadata objects and @__PURE__ comments.
 *
 * GOAL:
 * To verify that the "Miner" successfully identifies, extracts, and
 * replaces code as it would during a real production build.
 */
export function mineTransformation(
  code: string,
  globalRegistry = new Map<string, string>(),
) {
  const filename = UTIL_CONFIG_OPTIONS.fileName;
  const target = ts.ScriptTarget.Latest;

  // 1. Create a stable source file object first
  const sourceFileRef = ts.createSourceFile(filename, code, target, true);

  const defaultHost = ts.createCompilerHost({ target });
  const customHost: ts.CompilerHost = {
    ...defaultHost,
    getSourceFile: (name, version, ...args) =>
      name === filename
        ? sourceFileRef
        : defaultHost.getSourceFile(name, version, ...args),
    readFile: (name) => (name === filename ? code : defaultHost.readFile(name)),
    fileExists: (name) => name === filename || defaultHost.fileExists(name),
  };

  const program = ts.createProgram(
    [filename],
    {
      target,
      module: ts.ModuleKind.CommonJS,
      lib: [UTIL_CONFIG_OPTIONS.programLib],
    },
    customHost,
  );

  program.getSemanticDiagnostics(sourceFileRef);

  const transformationContext: ts.TransformationContext = {
    getCompilerOptions: () => ({}),
    factory: ts.factory,
    startLexicalEnvironment: () => {},
    suspendLexicalEnvironment: () => {},
    resumeLexicalEnvironment: () => {},
    endLexicalEnvironment: () => [],
    setLexicalEnvironmentFlags: () => {},
    getLexicalEnvironmentFlags: () => 0,
    hoistFunctionDeclaration: () => {},
    hoistVariableDeclaration: () => {},
    readEmitHelpers: () => undefined,
    requestEmitHelper: () => {},
    onSubstituteNode: (_hint, node) => node,
    onEmitNode: (_hint, node, emitCallback) => emitCallback(_hint, node),
  } as any;

  //  Run Visitor on the BOUND source file
  const visitor = createVisitor(
    program,
    transformationContext,
    sourceFileRef,
    globalRegistry,
  );
  const result = ts.visitNode(sourceFileRef, visitor) as ts.SourceFile;

  const printer = ts.createPrinter({ removeComments: false });
  return printer.printFile(result);
}
