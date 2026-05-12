// transformer/index.ts
import './reifiers/registry/index';
import ts from 'typescript';
import { theMiner } from './miner';
import { hydrateIntellisenseBridge } from './emitters';
import type { TVaultSyncPayload } from '../src/models/types';
import { visitNode } from 'typescript';
import { XalethorService } from '../src/xalor-service';
import { logDev } from '../src/utils';
import { IS_SOLID_CONFIG_ITEMS } from '../src/models/constants';
export default function (
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  const rootDir = program.getCompilerOptions().rootDir ?? process.cwd();
  const sourceFiles = program.getSourceFiles();

  // 🚀 STAGE 4.5: BUILD-TIME HYDRATION
  // We wake up the Vault and load the Bunker BEFORE we start mining.
  // This ensures the Transformer knows about existing UUIDs.
  try {
    const archive = new XalethorService();
    archive.hydrateFromGenesis(rootDir);
  } catch {
    // Silence for clean builds
  }

  const sessionRegistry = new Map<string, string>();
  // The strictly-typed in-memory manifest for this build session.
  const globalKeyRegistry = new Map<string, TVaultSyncPayload>();

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      if (!program || typeof program.getTypeChecker !== 'function') {
        /* prettier-ignore */ logDev(`[xalor] ⚠️ TypeChecker not found for: ${sourceFile.fileName}`, { type: 'warn', service: 'transformer/index.ts', override: true });
        return sourceFile;
      }
      /**
       * 🚄 ADAPTIVE BAILOUT (First-Pass Filter)
       * We scan the raw text for core functions (isXalor, toXalor).
       * If missing, we skip the expensive AST visitor entirely.
       */
      const coreFunctions = IS_SOLID_CONFIG_ITEMS.sentryTriggers;
      const shouldProcess = coreFunctions.some((fn) =>
        sourceFile.text.includes(fn),
      );
      let transformedFile: ts.SourceFile;

      if (!shouldProcess) {
        // 💨 Fast-path: Skip mining but allow the Persistence Gate check
        transformedFile = sourceFile;
      } else {
        // ⛏️ Heavy-path: Run the Miner
        const visitor = theMiner(
          program,
          context,
          sourceFile,
          globalKeyRegistry,
          sessionRegistry,
        );
        transformedFile = visitNode(sourceFile, visitor) as ts.SourceFile;
      }

      // 2. STAGE 4 TRIGGER: The Final Flush
      const lastFile = sourceFiles[sourceFiles.length - 1];
      const isLastFile = lastFile?.fileName === sourceFile.fileName;
      const isTest = process.env.NODE_ENV === 'test';

      /**
       * 🏁 STAGE 4 TRIGGER: THE PERSISTENCE GATE
       *
       * We trigger the flush if:
       * 1. It's the last file of a full production build.
       * 2. We are in a Test Environment AND we actually found types to save.
       */
      const shouldFlush = isLastFile || (isTest && globalKeyRegistry.size > 0);

      if (shouldFlush) {
        const archive = new XalethorService();

        // 💾 PERSISTENCE: Create node_modules/.cache/xalor/vault-snapshot.json
        archive.persist({ rootDir, registry: globalKeyRegistry });

        // 🌉 BRIDGE: Create src/.xalor/solid-env.d.ts
        hydrateIntellisenseBridge(rootDir, globalKeyRegistry);

        // 🚀 INJECTION: If testing, populate RAM so the current test passes
        // TODO: REMOVE WHNE BUILDING PACKAGE
        if (isTest) {
          globalKeyRegistry.forEach((payload) => {
            XalethorService.solidify(payload);
          });

          // Log only once per file to keep output clean
          logDev(
            `[xalor] 📦 Test Environment Synced: ${globalKeyRegistry.size} types cached & injected.`,
            { service: 'transformer/index.ts' },
          );
        }
      }

      return transformedFile;
    };
  };
}
/**
# 🚀 Xalor Optimization & Reliability Roadmap

## 1. 🚄 The Transformer "Bailout" (Build-Time Speed)

Currently, your transformer visits every single node in your project. In a massive project, this adds seconds to every save.

### ✅ The Fix
Implement a **"First-Pass Filter"**.

Before running the expensive `getTypeChecker` logic, perform a lightweight raw string scan on the source file text for:

- `isXalor`
- `toXalor`

If neither string exists, skip the file entirely.

### 💡 Why This Matters
`getTypeChecker` is extremely expensive.

Skipping it for ~90% of files can make builds feel nearly instantaneous, especially in large monorepos or enterprise codebases.

---

## 2. 🧠 The Blueprint "Interning" (Memory Efficiency)

In large projects, many types share identical sub-structures.

Example:

```ts
{
  metadata: {
    createdAt: string;
    updatedAt: string;
  }
}
  Without optimization, these structures get duplicated repeatedly in memory.

✅ The Fix

Implement Structural Interning in the XalethorVaultKeeper.

If two blueprints are structurally identical, they should reference the same memory address instead of duplicating data.

💡 Why This Matters

This can reduce the RAM footprint of vault-snapshot.json by up to 40% in large-scale enterprise applications.

3. 🛡️ The "Hot-Path" Guardrails (Runtime Security)

We need protection against:

Circular references
Depth bombs
Infinite recursion

Example:

Without safeguards, produceDefault() could recurse infinitely and crash.

✅ The Fix

Add a maxDepth counter to TValidationContext.

If traversal exceeds a safe depth (typically 10–20 levels):

stop traversal
return a "Ghost Reference"
or return null
💡 Why This Matters

Prevents Denial of Service (DoS) attacks where maliciously deep JSON objects crash your server.

📍 The "Double-GPS" Auditor (Final Utility)

We still need the utility that makes runtime errors clickable.

✅ Next Utility to Build
getCallerLocation()

This utility parses Error.stack at runtime to locate the exact file and line where isXalor() was called.

Example Output
 */
