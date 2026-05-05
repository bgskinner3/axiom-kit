// transformer/emitter.ts
import { IS_SOLID_CONFIG_ITEMS } from '../models/constants';
import * as fs from 'fs';
import * as path from 'path';

export function emitAmbientTypes(
  rootDir: string,
  registry: Map<string, string>,
) {
  const modelsDir = path.join(rootDir, IS_SOLID_CONFIG_ITEMS.modelsDirName);
  const envFile = path.join(modelsDir, IS_SOLID_CONFIG_ITEMS.ambientFileName);

  let dts = IS_SOLID_CONFIG_ITEMS.banner;
  dts += `import type { TSolid } from './index';\n\n`;
  dts += `declare module 'is-solid' {\n`;

  registry.forEach((_, key) => {
    dts += `  export function isSolid(data: unknown): data is TSolid<'${key}', any>;\n`;
  });
  dts += `}\n`;

  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  const existing = fs.existsSync(envFile)
    ? fs.readFileSync(envFile, 'utf8')
    : '';
  if (dts !== existing) {
    fs.writeFileSync(envFile, dts);
  }
}
