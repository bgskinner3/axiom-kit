import ts from 'typescript';
import { reifyType } from '../transformer/reifiers';
// import type { TSolidShape } from '../transformer/types';
import { IS_SOLID_CONFIG_ITEMS } from '../src/models';

beforeEach(() => {
  // Clear the global vault before every single test
  const globalObj = globalThis as any;
  if (globalObj[IS_SOLID_CONFIG_ITEMS.solidVaultKey]) {
    globalObj[IS_SOLID_CONFIG_ITEMS.solidVaultKey].clear();
  }
});

describe('Solid Resolver (The Miner)', () => {
  // Helper to create a "Live" TS environment for a string of code
  function getTestType(code: string, interfaceName: string) {
    const fileName = 'test.ts';

    // 1. Create the Program with the code already inside
    const host = ts.createCompilerHost({});
    host.getSourceFile = (name) =>
      name === fileName
        ? ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest)
        : undefined;

    const program = ts.createProgram([fileName], { lib: ['esnext'] }, host);
    const checker = program.getTypeChecker();
    const sourceFile = program.getSourceFile(fileName);

    // 2. Find the interface node
    const node = sourceFile?.statements.find(
      (s): s is ts.InterfaceDeclaration =>
        ts.isInterfaceDeclaration(s) && s.name.text === interfaceName,
    );

    if (!node) throw new Error(`Could not find interface ${interfaceName}`);

    return { type: checker.getTypeAtLocation(node), checker };
  }

  it('should resolve a basic object with primitives', () => {
    const { type, checker } = getTestType(
      `interface User { id: string; age: number; }`,
      'User',
    );

    const shape = reifyType(type, checker);

    expect(shape.kind).toBe('object');
    if (shape.kind === 'object') {
      expect(shape.properties.id).toEqual({
        kind: 'primitive',
        type: 'string',
      });
      expect(shape.properties.age).toEqual({
        kind: 'primitive',
        type: 'number',
      });
    }
  });

  it('should catch recursion and return a reference', () => {
    const { type, checker } = getTestType(
      `interface Node { next: Node; }`,
      'Node',
    );

    const shape = reifyType(type, checker);

    if (shape.kind === 'object') {
      expect(shape.properties.next).toMatchObject({
        kind: 'reference',
        name: 'Node',
      });
    }
  });
});
