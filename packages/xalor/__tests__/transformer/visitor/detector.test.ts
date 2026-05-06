import { identifySolidCall } from '../../../transformer/visitor/detector';
import ts from 'typescript';

describe('Visitor Detector', () => {
  function getCallNode(code: string) {
    const filename = 'test.ts';
    const sourceFile = ts.createSourceFile(
      filename,
      code,
      ts.ScriptTarget.Latest,
      true,
    );

    // Find the first CallExpression in the file
    let callNode: ts.CallExpression | undefined;

    function findCall(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        callNode = node;
        return;
      }
      ts.forEachChild(node, findCall);
    }

    findCall(sourceFile);

    // Setup a minimal program to get the checker
    const program = ts.createProgram(
      [filename],
      { target: ts.ScriptTarget.Latest },
      {
        ...ts.createCompilerHost({}),
        getSourceFile: (name) => (name === filename ? sourceFile : undefined),
        readFile: (name) => (name === filename ? code : undefined),
        fileExists: (name) => name === filename,
      },
    );

    return { node: callNode!, checker: program.getTypeChecker() };
  }

  it('should extract key and shape types from isSolid call', () => {
    const { node, checker } = getCallNode(
      `isSolid<'USER', { id: number }>(data);`,
    );

    const { keyType, shapeType } = identifySolidCall({ node, checker });

    expect(checker.typeToString(keyType)).toBe('"USER"');
    expect(shapeType.getProperties()).toHaveLength(1);
    expect(shapeType.getProperties()[0].getName()).toBe('id');
  });

  it('should return unknown types if generics are missing', () => {
    const { node, checker } = getCallNode(`isSolid(data);`);

    const { keyType, shapeType } = identifySolidCall({ node, checker });

    expect(checker.typeToString(keyType)).toBe('unknown');
    expect(checker.typeToString(shapeType)).toBe('unknown');
  });
});
