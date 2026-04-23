// core.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Core Utilities Type Checks', () => {
  it('should pass all type assertions in core.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/core.test.ts'),
    );
  }, 10000);
});
