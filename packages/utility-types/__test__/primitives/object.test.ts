// // object.test.ts
// import { expectTypeTestsToPassAsync } from 'jest-tsd';

// describe('Object Primitive Type Checks', () => {
//   it('should pass all type assertions in object.test-d.ts', async () => {
//     // Points to this file to resolve 'object.test-d.ts' in the same folder
//     await expectTypeTestsToPassAsync(
//       'tests/types/primitives/test-setup/objects.test.ts',
//     );
//   }, 10000);
// });

// __tests__/types/primitives/object.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Object Primitive Type Checks', () => {
  it('should pass all type assertions in object.test-d.ts', async () => {
    /**
     * 1. Change 'tests' to '__tests__'
     * 2. Change 'objects.test.ts' to 'object.test-d.ts'
     * 3. Use path.join to avoid root-path confusion
     */
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/objects.test.ts'),
    );
  }, 10000);
});
