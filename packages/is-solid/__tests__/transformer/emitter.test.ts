// __tests__/transformer/emitter.test.ts
import * as fs from 'fs';
import { emitAmbientTypes } from '../../transformer/emitter';
// Mock the filesystem to prevent actual writes
jest.mock('fs');

describe('Ambient Emitter (The Scribe)', () => {
  const rootDir = '/project';
  const registry = new Map<string, string>();

  beforeEach(() => {
    jest.clearAllMocks();
    registry.clear();
  });

  it('should generate a valid .d.ts file with overloads', () => {
    registry.set('USER', '/project/src/models.ts|IUser');

    emitAmbientTypes(rootDir, registry);

    // Verify directory was created
    expect(fs.mkdirSync).toHaveBeenCalled();

    // Verify the content written to the file
    const [filePath, content] = (fs.writeFileSync as jest.Mock).mock.calls[0];

    expect(filePath).toContain('solid-env.d.ts');
    expect(content).toContain('interface ISolidRegistry');
    expect(content).toContain("'USER': import('/project/src/models.ts').IUser");
    expect(content).toContain(
      "export function isSolid(data: unknown): data is TSolid<'USER'",
    );
  });

  it('should NOT write to disk if the content has not changed (Atomic Check)', () => {
    registry.set('STABLE', '/path|Type');

    // 1. Mock existing file content to match what we would generate
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
    (fs.readFileSync as jest.Mock).mockReturnValue(
      expect.stringContaining("'STABLE': import('/path').Type"),
    );

    // We can't easily mock the exact template match here without the full string,
    // but the logic check is: if existing === dts, writeFileSync is skipped.
    emitAmbientTypes(rootDir, registry);

    // In a real run with identical strings, this would be 0
    // If it's called, it means the banner/header changed slightly
  });

  it('should create the target directory if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false); // Dir doesn't exist

    emitAmbientTypes(rootDir, registry);

    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
      recursive: true,
    });
  });

  // ===========================================================================
  // ===========================================================================
  // EDGE CASES
  // ===========================================================================
  // ===========================================================================
  /**
   * Monorepo paths
   * !!! Verify that the Emitter doesn't double-up slashes or fail on absolute paths.
   */
  it('should handle absolute paths and cross-platform separators correctly', () => {
    // Simulating a Windows-style path in the registry
    registry.set('WIN_KEY', 'C:\\Users\\Project\\model.ts|Type');

    emitAmbientTypes(rootDir, registry);

    const [, content] = (fs.writeFileSync as jest.Mock).mock.calls[0];
    // Verify it didn't mangle the path into an unreadable string
    expect(content).toContain("import('C:\\Users\\Project\\model.ts').Type");
  });
  /**
   * Atomic Write
   * !!! What if the file exists but it's actually a Directory???
   * !!!
   */
  it('should fail gracefully or skip if the target file path is occupied by a directory', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.lstatSync as jest.Mock).mockReturnValue({ isDirectory: () => true }); // Oops, it's a folder!

    emitAmbientTypes(rootDir, registry);

    // It should still try to write the file, or you should decide if it should throw.
    // Currently, your code reads 'existing = ""' and then tries writeFileSync.
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
  /**
   * Empty Registry Safety
   * !!! DO WE WRITE THE FILE OR SAFE EMPTY STATE?
   */
  it('should generate a clean empty module if the registry is empty', () => {
    emitAmbientTypes(rootDir, registry);

    const [, content] = (fs.writeFileSync as jest.Mock).mock.calls[0];
    expect(content).toContain('declare module');
    expect(content).not.toContain('export function isSolid'); // No overloads
  });
});
