import { transform } from '../../test-utils';

describe('Visitor Orchestrator (Aggressive Coverage)', () => {
  it('should transform multiple calls in the same file', () => {
    const code = `
      isSolid<'A', string>(a);
      isSolid<'B', number>(b);
    `;
    const output = transform(code);

    // Verify both are injected
    expect(output).toContain('key: "A"');
    expect(output).toContain('key: "B"');
    expect(output).toContain('area: "test.ts:2:7"');
    expect(output).toContain('area: "test.ts:3:7"');
  });

  it('should find isSolid calls deeply nested in other structures', () => {
    const code = `
      function wrapper() {
        if (true) {
          return [1, 2].map(x => isSolid<'NESTED', number>(x));
        }
      }
    `;
    const output = transform(code);

    // Verify recursion (visitEachChild) actually reaches the inner call
    expect(output).toContain('key: "NESTED"');
    expect(output).toContain('/** @__PURE__ */');
  });

  it('should ignore calls that are NOT isSolid', () => {
    const code = `
      const x = notIsSolid<'KEY', string>(data);
      const y = isSolidCustom();
    `;
    const output = transform(code);

    // Verify output remains unchanged for these calls
    expect(output).not.toContain('key: "KEY"');
    expect(output).toContain('notIsSolid');
  });

  it('should update the global registry with file and type name', () => {
    const registry = new Map<string, string>();
    const code = `isSolid<'REG_TEST', { id: string }>(data);`;

    transform(code, registry);

    // Verify Pillar 1: Metadata Extraction into the registry
    const entry = registry.get('REG_TEST');
    expect(entry).toContain('test.ts');
    expect(entry).toContain('{ id: string; }');
  });

  it('should handle complex intersections as the shape type', () => {
    const code = `
      type Base = { id: number };
      isSolid<'COMPLEX', Base & { name: string }>(data);
    `;
    const output = transform(code);

    // Verify the processor and reifier worked together on the intersection
    expect(output).toContain('key: "COMPLEX"');
    expect(output).toContain('kind: "intersection"');
  });
  // EDGE CASES
  /**
   * "Shadowing" Case
   * !!! Ef a developer names a local function isSolid?
   * !!! Visitor must use the TypeChecker to ensure it only
   * !!! transforms the real library function, not a fake one
   */
  it('should NOT transform a local function named isSolid', () => {
    const code = `
    function isSolid(a) { return true; }
    isSolid<'FAKE', string>(data);
  `;
    const output = transform(code);

    // It should NOT contain the metadata object because it's the wrong function
    expect(output).not.toContain('key: "FAKE"');
  });
  /**
   * Missing Generics
   * !!!What happens if the dev calls isSolid(data) without the
   * !!! <Key, Type>? Your Visitor should skip it gracefully rather than crashing the build.
   */
  it('should gracefully skip calls with missing type arguments', () => {
    const code = `isSolid(data);`;
    const output = transform(code);

    // 💎 Use .trim() to ignore trailing newlines from the printer
    expect(output.trim()).toBe('isSolid(data);');
  });
  /**
   * Member Access
   * !!! Sometimes one may import the library as a namespace (e.g., Solid.isSolid).
   * !!! WE TEST HErE so that we know the Visitor handles this or only top-level imports.
   */
  it('should handle (or ignore) member access calls based on guard logic', () => {
    const code = `Solid.isSolid<'MEMBER', string>(data);`;
    const output = transform(code);

    expect(output).not.toContain('key: "MEMBER"');
  });
});
