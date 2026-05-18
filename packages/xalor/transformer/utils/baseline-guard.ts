// transformer/utils/baseline-guard.ts
import * as fs from 'fs';
import * as path from 'path';
import { logDev } from '../../shared';

/**
 * 🛠️ WORKER: ENSURE BASELINE CACHE (Cold-Start Guard)
 *
 * ROLE:
 * Generates project-local directory trees and drops empty baseline type bridges
 * onto the user's filesystem immediately during initial boot if the cache is missing.
 *
 * STRATEGY:
 * Solves cold-start IDE import resolution breaks cleanly by copying ready-to-go templates,
 * then returning the redirected snapshot path string back to the hydration caller.
 *
 * WHY:
 * Satisfies Commandment II (Build-Time Construction Rule). Keeping this exclusively
 * inside the transformer utilities ensures that file creation operations never bleed
 * into browser or edge runtime bundles.
 */
export function ensureBaselineCache(
  localCacheDir: string,
  fallbackSnapshotPath: string,
): string {
  try {
    // 1. Create the local project cache directory folder tree structure immediately
    if (!fs.existsSync(localCacheDir)) {
      fs.mkdirSync(localCacheDir, { recursive: true });
    }

    // 2. Resolve relative path pointers for the static templates bundled inside your npm package
    const templateBridgePath = path.join(
      __dirname,
      '../static-templates/solid-env.d.ts.template',
    );
    const localBridgeFile = path.join(localCacheDir, 'solid-env.d.ts');

    // 3. Physical file copy of the ghost bridge directly to disk
    if (fs.existsSync(templateBridgePath) && !fs.existsSync(localBridgeFile)) {
      fs.copyFileSync(templateBridgePath, localBridgeFile);
    }

    /* prettier-ignore */
    logDev(`[xalor:genesis] ❄️ Local cache empty. Initialized cold-start baseline templates.`, { service: 'transformer/boot' });

    // Redirected target pointer to point straight to the packaged JSON template
    return fallbackSnapshotPath;
  } catch (seedError) {
    /* prettier-ignore */
    logDev(`[xalor:genesis] ⚠️ Ambient preloading failed: Unable to write workspace folder tree configurations. (${seedError})`, { type: 'error', service: 'transformer/boot', override: true });

    // Fallback: Return the original path location parameter if file operations error out
    return fallbackSnapshotPath;
  }
}
