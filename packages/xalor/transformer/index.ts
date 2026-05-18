// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import type { TVaultSyncPayload } from '../shared';
import {
  bootloader,
  shouldProcessFile,
  runMiningPass,
  handlePersistenceGate,
} from './utils';
import { logDev } from '../shared';
/**
 * 🎛️ CORE TRANSFORMER SYSTEM SWITCHBOARD
 *
 * ROLE:
 * Executes the unified core processing logic using the isolated tracking maps
 * provided by the specific execution boundary host (Terminal vs IDE).
 */
function executeXalorMiningPass(
  program: ts.Program,
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile,
  rootDir: string,
  globalKeyRegistry: Map<string, TVaultSyncPayload>,
  sessionRegistry: Map<string, string>,
): ts.SourceFile {
  const snapshotSize = globalKeyRegistry.size;

  /** 🔍 SCOUT: Performance Short-Circuit Bailout */
  if (!shouldProcessFile(sourceFile, program)) {
    return handlePersistenceGate(
      sourceFile,
      program,
      rootDir,
      globalKeyRegistry,
      snapshotSize,
    );
  }

  /** ⛏️ MINER: Extraction & Code Injections Pass */
  const transformedFile = runMiningPass(
    program,
    context,
    sourceFile,
    globalKeyRegistry,
    sessionRegistry,
  );

  /** 📦 BANKER: Automated On-Save Save-Loop Persistence Gate */
  return handlePersistenceGate(
    transformedFile,
    program,
    rootDir,
    globalKeyRegistry,
    snapshotSize,
  );
}
/**
 * 💎 PATH A: TERMINAL COMPILER ENTRY POINT (ts-patch / tsup / build)
 * Allocates short-lived memory buckets isolated entirely to this terminal build run.
 */
export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  const rootDir = program.getCompilerOptions().rootDir ?? process.cwd();

  const sessionRegistry = new Map<string, string>();
  const globalKeyRegistry = new Map<string, TVaultSyncPayload>();

  bootloader(rootDir, globalKeyRegistry);

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      return executeXalorMiningPass(
        program,
        context,
        sourceFile,
        rootDir,
        globalKeyRegistry,
        sessionRegistry,
      );
    };
  };
}

/**
 * 🛰️ PATH B: IDE SHADOW SERVER ENTRY POINT (VS Code / Cursor / tsserver)
 * Allocates long-lived memory buckets bounded safely to the editor's background server process context.
 */
export function create(modules: { typescript: typeof ts }) {
  // const tsInstance = modules.typescript;
  if (!modules || !modules.typescript) {
    /* prettier-ignore */ logDev(`[xalor:ide-boot] ⚠️ Language Server missing core compiler module definitions. Initialization halted.`,{ service: 'transformer/index.ts/Main', type: 'error', override: true },);
    // Safe execution fallback return structure if IDE VS DOES NOT EXIST
    return { create: () => ({}) };
  }
  // Scoped memory allocations specific to this active editor workspace server stream process thread pass
  const sessionRegistry = new Map<string, string>();
  const globalKeyRegistry = new Map<string, TVaultSyncPayload>();

  return {
    create(info: ts.server.PluginCreateInfo): ts.LanguageService {
      const rootDir = info.project.getCurrentDirectory();
      bootloader(rootDir, globalKeyRegistry);

      if (info.languageServiceHost.getCustomTransformers) {
        const originalGetCustomTransformers =
          info.languageServiceHost.getCustomTransformers.bind(
            info.languageServiceHost,
          );

        info.languageServiceHost.getCustomTransformers = () => {
          // Preserve existing third-party transformers if they exist in the pipeline configuration
          const transformers = originalGetCustomTransformers() || {};
          const currentBefore = transformers.before || [];

          return {
            ...transformers,
            before: [
              ...currentBefore,
              (context: ts.TransformationContext) =>
                (sourceFile: ts.SourceFile) => {
                  // Extract the live, pre-cached program instance from the active service context
                  // FROM VS CODE
                  const program = info.languageService.getProgram();

                  if (!program) return sourceFile;

                  return executeXalorMiningPass(
                    program,
                    context,
                    sourceFile,
                    rootDir,
                    globalKeyRegistry,
                    sessionRegistry,
                  );
                },
            ],
          };
        };
      }

      return info.languageService;
    },
  };
}
