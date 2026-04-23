// __tests__/types/primitives/logic.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Logic Primitive Type Checks', () => {
  it('should pass all type assertions in logic.test-d.ts', async () => {
    // 1. Point to the NEW __tests__ folder
    // 2. Ensure it points to the .test-d.ts file
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/logic.test-d.ts'),
    );
  }, 10000);
});
