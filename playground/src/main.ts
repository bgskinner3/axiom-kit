import { isSolid, getSolid } from '@bgskinner2/xalor';

// 1. Define a complex type to test nested reification
interface User {
  id: number;
  name: string;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// 2. Register it
isSolid<'USER', User>();

// 3. Inspect it
const meta = getSolid('USER');

console.log('--- 💎 XALOR SHAPE INSPECTOR ---');
if (meta) {
  // console.dir shows the full nested object tree in the terminal
  console.dir(meta.shape, { depth: null, colors: true });
} else {
  console.log(
    "❌ FAILURE: No metadata found. Check if 'pnpm run build' was run in xalor.",
  );
}
