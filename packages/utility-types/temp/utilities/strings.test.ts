// strings.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('String Utilities Type Checks', () => {
  it('should pass all type assertions in strings.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup-strings/index.test-d.ts'),
    );
  }, 10000);
});
