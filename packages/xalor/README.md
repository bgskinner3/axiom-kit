<h1 align="center">🚀 Xalor</h1>

<p align="center">
  Turn TypeScript "ghost types" into real runtime validation
  <br />
  <strong>— with zero bundle cost</strong>
</p>

<p align="center">
  <img src="./assets/hero.png" alt="Xalor hero" width="600"/>
</p>

<p align="center">
  <em>Write types once. Ship nothing extra.</em>
</p>

---

## 🧠 What is Xalor?

Xalor is a **Type-First** validation ecosystem. It eliminates the need for separate schema libraries (like Zod or Joi) by using a build-time **Transformer** to "mine" your existing TypeScript interfaces and inject them into a runtime **Vault**.

### ⚓ The Five Pillars of Xalor

1. **The Miner**: A build-time transformer that reifies static types into JSON blueprints.
2. **The Vault**: A high-performance Triple-KV memory store for your type DNA.
3. **The Bridge**: An ambient Type Layer that gives you zero-import IDE autocomplete.
4. **The Bouncer**: A recursive validation engine with built-in Depth-Bomb protection.
5. **The Auditor**: A "Double-GPS" reporting system that links runtime failures back to source code.

---

## 🚨 The problem

In most TypeScript applications:

- Types exist only at compile time
- Runtime validation requires separate schema systems (Zod, Joi, etc.)
- This leads to duplication between:
  - TypeScript interfaces
  - validation schemas
- Developers often bypass safety using `as Type`, leading to "type lying"

---

## 🚨 The "Type Lying" Problem

In standard TypeScript apps, types vanish at runtime. To stay safe, developers maintain duplicate schemas (Zod/Joi). When these get out of sync, or when developers resort to `as Type` casting, "Type Lying" occurs—where the compiler believes the data is safe, but the runtime crashes.

**Xalor solves this by making your TypeScript interfaces the physical source of truth.**

---

## ⚙️ The Lifecycle (Stage 1-5)

### ⛏️ 1. Extraction (The Miner)

During your build (Webpack/Vite/Rollup), Xalor scans your code for calls to `isXalor`. It extracts the generic type (e.g., `User`) and converts it into a structural blueprint.

### 🗄️ 2. Persistence (The Bunker)

Extracted types are "shredded" into atomic fragments and saved to `node_modules/.cache/xalor`. This ensures your validation logic survives restarts and works across monorepo packages.

### 🌉 3. Intellisense (The Ghost Bridge)

Xalor generates an ambient declaration file (`solid-env.d.ts`). This allows your IDE to provide **full autocomplete** on string keys without you ever having to export or import a schema.

### 🛡️ 4. Validation (The Bouncer)

At runtime, the engine compares incoming data against the Vault's blueprints.

- **Identity Law**: Prevents stack overflows on circular references.
- **Depth Law**: Blocks "Depth Bomb" security attacks.

---

## 🧪 Core API

### `isXalor` (The Inspector)

The Swiss-Army knife of validation. Use it to check, assert, or parse data.

```typescript
// 1. Boolean Guard (True/False)
if (isXalor({ data, injectedKey: 'USER', mode: 'guard' })) {
  console.log(data.name); // data is automatically narrowed!
}

// 2. Assertion (Throws on fail)
isXalor({ data, injectedKey: 'USER', mode: 'assert' });

// 3. Parser (Returns branded "Solid" data)
const user = isXalor({ data, injectedKey: 'USER', mode: 'parse' });
```

### `toXalor` (The Architect)

The generator counterpart used to materialize data from blueprints.

```typescript
// Generate a valid "Zero-Value" object from an interface
const newUser = toXalor({ injectedKey: 'USER', mode: 'default' });

// Deep-clone and sanitize (strips properties not in the TS interface)
const safeUser = toXalor({
  data: rawApiData,
  injectedKey: 'USER',
  mode: 'clone',
});
```

---

## 🕵️‍♂️ The Auditor (Double-GPS Reporting)

When a validation fails, Xalor doesn't just say "Invalid." It provides a clickable trace:

```bash
[xalor] 🛑 SOLIDITY BREAK: "USER"
  ❌ Path: $.profile.email
     Expected: string (maxLength: 4096)
     Received: number (123)
     📍 Origin: src/models/User.ts:12:5  <-- Click to see the Type
     ⚡ Failed: src/api/handler.ts:45:10 <-- Click to see the Data
```

---

## 🚄 Performance

- **Zero Bundle Bloat**: Type metadata is injected only where used.
- **Interning**: Identical sub-structures share the same memory reference.
- **Bailout**: Build-time scout skips files that don't use Xalor, keeping builds fast.

---
