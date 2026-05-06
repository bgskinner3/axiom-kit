import ts from 'typescript';
import { createVisitor } from '../transformer/visitor';
/**
 * TEST UTILITY: Virtual Compiler Host
 *
 * This function creates a transient, in-memory TypeScript environment to
 * extract real `ts.Type` objects from raw strings. It is essential for
 * unit testing Reifiers without the overhead of a full filesystem build.
 *
 * **!!!!How it works:!!!!!!
 * 1. VIRTUAL FILE: It creates a 'Virtual SourceFile' from your test string.
 * 2. CUSTOM HOST: It overrides the standard Compiler Host to intercept file
 *    requests. When the compiler asks for 'test.ts', we hand it our in-memory
 *    file instead of checking the disk.
 * 3. PROGRAM BOOTSTRAP: It initializes a `ts.Program` using this custom host.
 * 4. TYPE EXTRACTION: It locates the first `interface` or `type` alias in the
 *    code and uses the `TypeChecker` to resolve it into a live Type object.
 *
 * @param sourceCode - A string of TS code (e.g., 'interface User { id: string }')
 * @returns { type: ts.Type, checker: ts.TypeChecker }
 */
const AMBIENT_SOLIDS = `
  type TSolid<K extends string, T> = T & { readonly __brand: K };
`;

export function createTestType(sourceCode: string) {
  const filename = 'test.ts';
  const fullSource = `${AMBIENT_SOLIDS}\n${sourceCode}`;
  const target = ts.ScriptTarget.Latest;

  const sourceFile = ts.createSourceFile(filename, fullSource, target, true);
  const defaultHost = ts.createCompilerHost({ target });

  const customHost: ts.CompilerHost = {
    ...defaultHost,
    getSourceFile: (name, version, ...args) => {
      // 💎 If it's our test file, return the virtual one
      if (name === filename) return sourceFile;
      // 💎 Otherwise, let the REAL host find the lib.d.ts files on your Mac
      return defaultHost.getSourceFile(name, version, ...args);
    },
    writeFile: () => {},
    fileExists: (name) => name === filename || defaultHost.fileExists(name),
    readFile: (name) =>
      name === filename ? fullSource : defaultHost.readFile(name),
  };

  const program = ts.createProgram(
    [filename],
    {
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.CommonJS,
      noLib: true, // Since we are only testing internal logic, we don't need real libs yet
    },
    customHost,
  );

  const checker = program.getTypeChecker();

  const statements = sourceFile.statements.filter(
    (s): s is ts.TypeAliasDeclaration | ts.InterfaceDeclaration =>
      ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s),
  );

  const statement = statements[statements.length - 1];
  const type = ts.isInterfaceDeclaration(statement)
    ? checker.getTypeAtLocation(statement.name)
    : checker.getTypeFromTypeNode(statement.type);

  return { type, checker };
}
/**
 * 🛠️ TEST HELPER: Virtual Transformer
 * Runs the createVisitor logic against a string of code.
 */
export function transform(
  code: string,
  globalRegistry = new Map<string, string>(),
) {
  const filename = 'test.ts';
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
      lib: ['lib.esnext.d.ts'],
    },
    customHost,
  );

  // 💎 CRITICAL: This primes the TypeChecker and forces symbol binding
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

  // 3. Run Visitor on the BOUND source file
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
// export function transform(
//   code: string,
//   globalRegistry = new Map<string, string>(),
// ) {
//   const filename = 'test.ts';
//   const target = ts.ScriptTarget.Latest;
//   const sourceFile = ts.createSourceFile(filename, code, target, true);

//   const defaultHost = ts.createCompilerHost({ target });
//   // const customHost: ts.CompilerHost = {
//   //   ...defaultHost,
//   //   getSourceFile: (name, version, ...args) =>
//   //     name === filename
//   //       ? sourceFile
//   //       : defaultHost.getSourceFile(name, version, ...args),
//   //   readFile: (name) => (name === filename ? code : defaultHost.readFile(name)),
//   //   fileExists: (name) => name === filename || defaultHost.fileExists(name),
//   // };
//   const customHost: ts.CompilerHost = {
//     ...defaultHost,
//     getSourceFile: (name, version, onError) => {
//       // If it's our virtual file, return our sourceFile object
//       if (name === filename) return sourceFile;
//       // OTHERWISE: Let the real host find 'lib.esnext.d.ts' so 'number' is real
//       return defaultHost.getSourceFile(name, version, onError);
//     },
//     writeFile: () => {}, // Don't write to disk
//     fileExists: (name) => name === filename || defaultHost.fileExists(name),
//     readFile: (name) => (name === filename ? code : defaultHost.readFile(name)),
//   };
//   // const program = ts.createProgram(
//   //   [filename],
//   //   { target: ts.ScriptTarget.Latest },
//   //   {
//   //     ...defaultHost,
//   //     // 💎 FIX: Accept and pass the version/options arguments
//   //     getSourceFile: (name, version, onError, shouldCreateNewSourceFile) =>
//   //       name === filename
//   //         ? sourceFile
//   //         : defaultHost.getSourceFile(
//   //             name,
//   //             version,
//   //             onError,
//   //             shouldCreateNewSourceFile,
//   //           ),
//   //     readFile: (name) =>
//   //       name === filename ? code : defaultHost.readFile(name),
//   //     fileExists: (name) => name === filename || defaultHost.fileExists(name),
//   //   },
//   // );
//   const program = ts.createProgram(
//     [filename],
//     {
//       target,
//       module: ts.ModuleKind.CommonJS,
//       lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
//     },
//     customHost,
//   );

//   // 2. Mock Transformation Context (Required for the Factory)
//   const transformationContext: ts.TransformationContext = {
//     getCompilerOptions: () => ({}),
//     factory: ts.factory,
//     startLexicalEnvironment: () => {},
//     suspendLexicalEnvironment: () => {},
//     resumeLexicalEnvironment: () => {},
//     endLexicalEnvironment: () => [],
//     setLexicalEnvironmentFlags: () => {},
//     getLexicalEnvironmentFlags: () => 0,
//     hoistFunctionDeclaration: () => {},
//     hoistVariableDeclaration: () => {},
//     readEmitHelpers: () => undefined,
//     requestEmitHelper: () => {},
//     onSubstituteNode: (_hint, node) => node,
//     onEmitNode: (_hint, node, emitCallback) => emitCallback(_hint, node),
//   } as any;

//   // 3. Run the Visitor
//   const visitor = createVisitor(
//     program,
//     transformationContext,
//     sourceFile,
//     globalRegistry,
//   );
//   const result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

//   // 4. Print the result back to a string for assertion
//   const printer = ts.createPrinter({ removeComments: false });
//   return printer.printFile(result);
// }
