# isSolid

Turn TypeScript "ghost types" into real runtime validation — with zero bundle cost


## What is this?
isSolid is a TypeScript transformer that converts your types into real JavaScript checks at build time.

No schemas.
No runtime libraries.
No duplicated logic.

```ts

const user = isSolid<User>(data);

```
⬇️ becomes compiled JavaScript like:

```ts

typeof data.name === "string" && typeof data.email === "string"

```


### The Problem
TypeScript types disappear at runtime.

That means:

❌ API data can be wrong
❌ as User lies to the compiler
❌ Apps crash on undefined
❌ You duplicate types + validation (Zod, Ajv, etc.)

## 💎 The Solution
isSolid "solidifies" your types during build.

🔍 Scans your code (AST)
🧠 Understands your types
⚙️ Injects real validation logic
🧱 Ships plain JavaScript (0kb overhead)


## 🔥 Key Features

✅ Zero Runtime Cost

No Zod. No Ajv. No validators shipped.

✅ No More as Casting

You only get the type if it’s actually valid.

✅ Single Source of Truth

Define your type once — use it everywhere.

✅ Self-Healing Data

```ts
const user = fillSolid<User>(apiData);
```
Missing fields? Automatically filled with safe defaults.


## ⚡ Quick Example

```ts
interface User {
  name: string;
  role: "admin" | "user";
}

const input = { name: "John", role: "admin" };

if (isSolid<User>(input)) {
  // fully type-safe + runtime validated
}
```

## 🧠 How It Works (Simple)

Scan → finds isSolid<T>()
Analyze → reads your TypeScript types
Transform → replaces calls with real JS
Ship → no extra libraries, just optimized code


## 🏛️ Advanced Concept: The "Solid Vault"

isSolid can turn your types into a global runtime database.

```ts 
getSolid("User");
```

🌍 Available anywhere (no imports)
🧬 Fully typed (autocomplete works)
⚡ Instant access


## 🛠️ Core APIs

```ts 
isSolid<T>(value)        // validate
fillSolid<T>(value)      // validate + autofill
getSolid(key)            // access global type
getSolidDefault(key)     // generate defaults

```


## 🎯 Why Not Zod / Ajv?

| Feature              | isSolid | Zod/Ajv |
|---------------------|--------|--------|
| Runtime cost        | ✅ 0kb | ❌ Yes |
| Duplicate schemas   | ❌ No  | ✅ Yes |
| Build-time transform| ✅ Yes | ❌ No  |
| Type-first DX       | ✅ Yes | ⚠️ Partial |


## 🧩 Philosophy


Write types once.
Use them everywhere.
Ship nothing extra.



## 📦 Installation (Coming Soon)
```bash
npm install xalor

```
### 🧪 Vision
🌐 Export types to backend (Go, Rust, Python)
🎲 Auto-generate mock data
⚡ HMR-powered live type updates
📉 Production pruning for minimal builds

## 📄 License
MIT


### Why this version works better
Cuts ~70% of the text
Keeps your metaphor ("ghost types"), but doesn’t overuse it
Moves from vision → value → proof → API
Optimized for npm skimming behavior
Still preserves your deeper ideas (Vault, transformer, etc.)


{
"compilerOptions": {
"plugins": [
{
"transform": "@bgskinner2/is-solid/transformer",
"type": "program"
}
]
}
}
Abstract Syntax Tree (AST).
