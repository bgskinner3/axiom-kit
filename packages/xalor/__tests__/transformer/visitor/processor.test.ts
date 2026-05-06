import ts from 'typescript';
import { solidVisitorProcessor } from '../../../transformer/visitor/processor';
describe('Visitor Processor', () => {
  const f = ts.factory;
  const printer = ts.createPrinter();

  it('should transform a call expression into a registration call', () => {
    const sourceCode = "isSolid<'USER', { id: number }>(data)";
    const sourceFile = ts.createSourceFile(
      'test.ts',
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
    );
    const node = (sourceFile.statements[0] as ts.ExpressionStatement)
      .expression as ts.CallExpression;

    const result = solidVisitorProcessor({
      node,
      shape: { kind: 'primitive', type: 'number' }, // Mock shape
      sourceFile,
      factory: f,
      key: 'USER',
    });

    const output = printer.printNode(
      ts.EmitHint.Unspecified,
      result,
      sourceFile,
    );

    // 🏛️ Verify the Processor's work
    expect(output).toContain('isSolid(data, {');
    expect(output).toContain('key: "USER"');
    expect(output).toContain('area: "test.ts:1:1"');
    expect(output).toContain('version:');
  });
});
