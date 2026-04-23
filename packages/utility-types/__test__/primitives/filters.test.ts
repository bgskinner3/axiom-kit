import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Filter Primitives Type Checks', () => {
  it('should pass all type assertions in filters.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      // ✅ Update this path to __tests__
      path.join(__dirname, 'test-setup/filters.test-d.ts'),
    );
  }, 10000);
});
