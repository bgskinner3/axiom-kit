import ts from 'typescript';
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
export function createTestType(sourceCode: string) {
  const filename = 'test.ts';
  const target = ts.ScriptTarget.Latest;

  const sourceFile = ts.createSourceFile(filename, sourceCode, target, true);

  const defaultHost = ts.createCompilerHost({ target });
  const customHost: ts.CompilerHost = {
    ...defaultHost,
    // 💎 FIX: Accept and pass the version/options arguments
    getSourceFile: (name, version) =>
      name === filename ? sourceFile : defaultHost.getSourceFile(name, version),
    writeFile: () => {},
    fileExists: (name) => name === filename,
    readFile: (name) => (name === filename ? sourceCode : undefined),
  };

  const program = ts.createProgram([filename], { target }, customHost);
  const checker = program.getTypeChecker();

  // Find the first type-like statement in the file
  const statement = sourceFile.statements.find(
    (s): s is ts.TypeAliasDeclaration | ts.InterfaceDeclaration =>
      ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s),
  );

  if (!statement) {
    throw new Error(
      'Test source must contain a type or interface declaration.',
    );
  }

  const type = ts.isInterfaceDeclaration(statement)
    ? checker.getTypeAtLocation(statement.name)
    : checker.getTypeFromTypeNode(statement.type);

  return { type, checker };
}
