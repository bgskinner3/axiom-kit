> ⚠️ **Work in Progress**
> This documentation is actively evolving. APIs, configuration steps, and behavior may change before the first stable release.

# SETTINGS

# 🛰️ Xalor Installation & Configuration Manual

Xalor is an ambient data integrity engine that compiles your native TypeScript types into light, hidden runtime blueprints with **zero duplicate code and near-zero bundle cost**.

---

### 📦 Step 1: Installation

Xalor requires native hook access to the **TypeScript Compiler API** during project compilation sweeps. It installs alongside **`ts-patch`**, the industry standard for executing custom AST transformers without mutating core compiler binaries.

Run the following command in your terminal to install the dependencies:

```bash
npm install --save-dev ts-patch typescript
npm install @bgskinner2/xalor
```

---

### 🎛️ Step 2: Configuration (`tsconfig.json` & Lifecycle Hooks)

To enable **Incremental Build-Time Type Reification**, you must register Xalor inside your project's TypeScript configuration and patch your local lifecycle scripts. This allows the framework to intercept your compilation passes transparently.

#### 1. Update `tsconfig.json`

Add the Xalor transformer to the `plugins` array directly under `compilerOptions`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,

    // 🚀 REGISTER THE AST MINER
    "plugins": [
      {
        "transform": "@bgskinner2/xalor/transformer"
      }
    ]
  },
  "include": ["src/**/*"]
}
```

#### 2. Patch Your `package.json` Scripts

TypeScript ignores custom transformers by default. Configure a `prepare` script to force `ts-patch` to wire itself into your project environment immediately after your node modules are installed.

Update your workspace tasks exactly like this:

```json
{
  "name": "my-xalor-app",
  "type": "module",
  "scripts": {
    // 🛠️ THE LIFECYCLE HOOK: Auto-patches your compiler on install
    "prepare": "ts-patch install",

    // 🚀 THE DEV LOOP: Watch mode automatically triggers on-save flushes
    "dev": "tsc --watch",

    // 📦 THE PRODUCTION PASS: Seals your final content-addressable Bunker cache
    "build": "tsc"
  }
}
```

---

### 💻 Step 3: IDE Optimization (`.vscode/settings.json`)

To unlock **Ambient HMR Hydration** so your type cache updates instantly on every file save—**without needing a terminal process running in the background**—you must configure your code editor to load your TypeScript plugins natively.

Modern code editors run an internal, background instance of TypeScript (called `tsserver`) to handle real-time autocompletes and error detection. By default, editors ignore your `tsconfig.json` plugins for security reasons.

#### Configure Your Local Workspace Settings

Create a `.vscode/settings.json` file in the root directory of your project:

```json
{
  "typescript.tsserver.pluginIds": ["@bgskinner2/xalor/transformer"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

### 🧪 Step 4: Real-World Usage Code (The Smoke Test)

Create a test file named `src/index.ts` in your project to verify that your **Incremental Build-Time Type Reification loop** is working properly. This is the smallest possible example of registering a type and executing validation.

```typescript
import { registerXalor, validateXalor } from '@bgskinner2/xalor';

// 1. Declare a standard type model using native TypeScript syntax
interface IAlphaUser {
  id: number;
  token: string;
}

// 2. Fire the Type Ingest Target (The Miner's Anchor)
registerXalor<'ALPHA_USER', IAlphaUser>();

const payload: unknown = { id: 777, token: 'solid_hash_value' };

// 3. Fire the Category 2 Validation Guard
// 🎯 DX FEATURE: Pass your type data and target execution mode purely as generics.
// The data object parameter is the ONLY runtime argument you need to input!
if (validateXalor<'ALPHA_USER', 'guard'>(payload)) {
  // 🚀 Inside this block, 'payload' is fully narrowed to your IAlphaUser type!
  console.log(`[xalor-smoke] Success: Payload Narrowed! ID: ${payload.id}`);
}
```

Now, press **Save** on this file inside your editor or run your build script in your terminal:

```bash
npm run build
```

Your project root will instantly generate a hidden data drawer containing your deep-interned types database layout:

```text
node_modules/.cache/xalor/
├── vault-snapshot.json <-- 🗄️ THE DATA: Content-Addressable structural graph database
└── solid-env.d.ts      <-- 🛰️ THE AUTOCOMPLETE: Nominal key intellisense declaration merging
```
