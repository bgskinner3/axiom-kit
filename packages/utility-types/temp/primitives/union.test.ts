// __tests__/types/primitives/union.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Union Primitive Type Checks', () => {
  it('should pass all type assertions in union.test-d.ts', async () => {
    // 1. Update 'tests' to '__tests__'
    // 2. Point to the '.test-d.ts' file
    // 3. Use path.join for reliability
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/union.test-d.ts'),
    );
  }, 10000);
});
