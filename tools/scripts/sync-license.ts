import fs from 'fs';
import path from 'path';

const LICENSE_PATH = './LICENSE';
const PACKAGES_DIR = './packages';

const packages = fs.readdirSync(PACKAGES_DIR);

packages.forEach((pkg) => {
  const targetDir = path.join(PACKAGES_DIR, pkg);
  if (fs.statSync(targetDir).isDirectory()) {
    fs.copyFileSync(LICENSE_PATH, path.join(targetDir, 'LICENSE'));
    console.log(`✅ Copied LICENSE to ${pkg}`);
  }
});
