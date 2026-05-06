// __tests__/transformer/orchestrator.test.ts
import ts from 'typescript';
import transformer from '../../transformer';
import * as fs from 'fs';

jest.mock('fs');
describe('Root Transformer Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 💎 Ensure fs.readFileSync returns empty by default so first write always happens
    (fs.readFileSync as jest.Mock).mockReturnValue('');
  });
  it('should orchestrate multiple files and emit a single registry', () => {
    const fileA = `isSolid<'USER_A', { id: 1 }>();`;
    const fileB = `isSolid<'USER_B', { id: 2 }>();`;

    // 1. Setup a real TS Program with two virtual files
    const sourceA = ts.createSourceFile(
      'a.ts',
      fileA,
      ts.ScriptTarget.Latest,
      true,
    );
    const sourceB = ts.createSourceFile(
      'b.ts',
      fileB,
      ts.ScriptTarget.Latest,
      true,
    );

    const program = ts.createProgram(
      ['a.ts', 'b.ts'],
      {},
      {
        ...ts.createCompilerHost({}),
        getSourceFile: (name) =>
          name === 'a.ts' ? sourceA : name === 'b.ts' ? sourceB : undefined,
        writeFile: () => {},
        fileExists: (name) => ['a.ts', 'b.ts'].includes(name),
        readFile: (name) =>
          name === 'a.ts' ? fileA : name === 'b.ts' ? fileB : undefined,
      },
    );

    // 2. Run the transformer
    const transformResult = ts.transform(
      [sourceA, sourceB],
      [transformer(program)],
    );

    // 🏛️ VERIFICATION 1: Code Transformation
    const printer = ts.createPrinter();
    const outputA = printer.printFile(transformResult.transformed[0]);
    const outputB = printer.printFile(transformResult.transformed[1]);

    expect(outputA).toContain('key: "USER_A"');
    expect(outputB).toContain('key: "USER_B"');

    // 🏛️ VERIFICATION: Singleton Registry & Final Emission
    const calls = (fs.writeFileSync as jest.Mock).mock.calls;

    // 1. Get the arguments from the LAST call
    const lastCallArgs = calls[calls.length - 1];

    // 2. Extract the CONTENT (the second argument)
    const lastCallContent = lastCallArgs[1];

    // 3. Assert on the string
    expect(lastCallContent).toContain("'USER_A':");
    expect(lastCallContent).toContain("'USER_B':");
  });
  // ===========================================================================
  // ===========================================================================
  // EDGE CASES
  // ===========================================================================
  // ===========================================================================
  /**
   * Ghost File" Case (Empty Files)
   * !!! Does the transformer crash if a file has zero code or zero isSolid calls?.
   */
  it('should handle files with no calls without crashing or emitting', () => {
    const emptyCode = `const x = 10;`;
    const source = ts.createSourceFile(
      'empty.ts',
      emptyCode,
      ts.ScriptTarget.Latest,
      true,
    );

    // Create a program that only contains this empty file
    const emptyProgram = ts.createProgram(
      ['empty.ts'],
      {},
      {
        ...ts.createCompilerHost({}),
        getSourceFile: (name) => (name === 'empty.ts' ? source : undefined),
        writeFile: () => {},
        fileExists: (name) => name === 'empty.ts',
        readFile: (name) => (name === 'empty.ts' ? emptyCode : undefined),
      },
    );

    ts.transform([source], [transformer(emptyProgram)]);

    // The registry should be 0, and writeFileSync should NEVER be called
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  /**
   * Cross-File Type Alias
   * !!! Can the transformer in b.ts see a type defined in a.ts?
   */

  it('should resolve types imported from other files', () => {
    const fileA = `export interface SharedUser { id: number }`;
    const fileB = `import { SharedUser } from './a'; isSolid<'KEY', SharedUser>();`;

    const sourceA = ts.createSourceFile(
      'a.ts',
      fileA,
      ts.ScriptTarget.Latest,
      true,
    );
    const sourceB = ts.createSourceFile(
      'b.ts',
      fileB,
      ts.ScriptTarget.Latest,
      true,
    );

    const defaultHost = ts.createCompilerHost({});
    const crossProgram = ts.createProgram(
      ['a.ts', 'b.ts'],
      {
        target: ts.ScriptTarget.Latest,
        lib: ['lib.esnext.d.ts'],
        // 💎 Ensure module resolution is set for relative imports
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
      },
      {
        ...defaultHost,
        getSourceFile: (name, version) => {
          if (name === 'a.ts' || name.endsWith('/a.ts')) return sourceA;
          if (name === 'b.ts' || name.endsWith('/b.ts')) return sourceB;
          return defaultHost.getSourceFile(name, version);
        },
        // 💎 FIX: Map the relative import './a' to our virtual 'a.ts'
        resolveModuleNames: (moduleNames, _containingFile) => {
          return moduleNames.map((name) => {
            if (name === './a') return { resolvedFileName: 'a.ts' };
            return undefined as any;
          });
        },
        fileExists: (name) =>
          ['a.ts', 'b.ts'].includes(name) || defaultHost.fileExists(name),
        readFile: (name) =>
          name === 'a.ts'
            ? fileA
            : name === 'b.ts'
              ? fileB
              : defaultHost.readFile(name),
      },
    );

    // 💎 Force the binding
    crossProgram.getSemanticDiagnostics();

    const result = ts.transform([sourceB], [transformer(crossProgram)]);
    const output = ts
      .createPrinter()
      .printFile(result.transformed[0] as ts.SourceFile);
    // 🏛️ VERIFICATION: The Miner found the interface in file A!
    expect(output).toContain('kind: "object"');

    // Verify the internal property details
    expect(output).toContain('"id": {');
    expect(output).toContain('type: "number"');
    expect(output).toContain('name: "id"');
  });
  /**
   * Double Transformation
   * !!! What if the same file is transformed twice? (Common in watch mode).
   */
  it('should be idempotent on re-runs (Watch Mode Simulation)', () => {
    const code = `isSolid<'STABLE', string>();`;
    const source = ts.createSourceFile(
      'test.ts',
      code,
      ts.ScriptTarget.Latest,
      true,
    );

    const host = {
      ...ts.createCompilerHost({}),
      getSourceFile: () => source,
      writeFile: () => {},
      fileExists: () => true,
      readFile: () => code,
    };

    const prog = ts.createProgram(['test.ts'], {}, host);
    const factory = transformer(prog);

    // Run 1
    ts.transform([source], [factory]);
    const firstWrite = (fs.writeFileSync as jest.Mock).mock.calls.length;
    const generatedContent = (fs.writeFileSync as jest.Mock).mock.calls[0][1];

    // 💎 THE FIX: Mock the read for the next run
    (fs.readFileSync as jest.Mock).mockReturnValue(generatedContent);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

    // Run 2
    ts.transform([source], [factory]);
    const secondWrite = (fs.writeFileSync as jest.Mock).mock.calls.length;

    expect(secondWrite).toBe(firstWrite);
  });
});
