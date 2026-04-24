import ts from 'typescript';
import transformer from '../transformer/index';
import { getSolid, isSolid } from '../src';
describe('Solid Transformer (Traceability)', () => {
  it('should transform, register, and validate with correct area info', () => {
    // 1. The code we want to "Real World" test
    const code = `
      import { isSolid } from 'is-solid';
      const data = { id: 123 }; // Error: should be string
      isSolid<"User", { id: string }>(data);
    `;

    // // 2. Run the actual Transformer logic
    // const result = ts.transpileModule(code, {
    //   fileName: '/project/src/user.ts',
    //   compilerOptions: { module: ts.ModuleKind.CommonJS },
    //   transformers: { before: [transformer(ts.createProgram([], {}))] },
    // });

    // 3. Execute the resulting JavaScript
    // We use eval to simulate the browser/node loading the file
    // Note: In a real test, 'isSolid' must be available in the execution scope
    // const execute = new Function('isSolid', result.outputText);

    // // We import the real isSolid from our src
    // // const { isSolid: realIsSolid } = require('../src');

    // execute(isSolid);

    // // 4. VERIFY: Did the Vault catch the metadata?
    // const stored = getSolid('User');

    // expect(stored).toBeDefined();
    // expect(stored?.key).toBe('User');

    // // 📍 VERIFY: Is the Area pinpoint accurate?
    // // Line 4 in our 'code' string is where isSolid lives
    // expect(stored?.area).toBe('/project/src/user.ts:4:7');
  });
});
