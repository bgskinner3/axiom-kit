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

--

## 🧠 What this is

Xalor is a TypeScript-powered runtime validation system that allows you to validate data using your existing TypeScript types — without writing separate schemas.

It bridges the gap between compile-time types and runtime validation by using a TypeScript AST transformer that extracts type information into a runtime registry ("Vault").

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

## 💎 The idea

Instead of duplicating schemas, Xalor turns TypeScript types into runtime-accessible metadata.

This means:

> Your TypeScript types become the single source of truth for both compile-time and runtime validation.

---

## ⚙️ How it works (high level)

### 1. Transformer (build step)

A TypeScript AST transformer scans your code and extracts type definitions.

These types are converted into structured metadata and registered into a global runtime store called the Vault.

---

### 2. Vault (runtime registry)

A global in-memory registry that stores all extracted type metadata.

This allows types to be accessed at runtime using a string key.

---

### 3. Validation engine

At runtime, Xalor uses the stored type metadata to validate incoming data.

If data does not match the expected structure, errors are stored in the Vault.

---

## 🧪 Core API

### `Xalor`

Validates data against a registered type.

```ts
isSolid<User>('User', data);
```

1. Hero (HTML)
2. Quick Example
3. Problem
4. Solution
5. Features
6. Comparison (Zod/Ajv)
7. Installation
8. Usage
9. API (optional but good)
10. How It Works
11. Advanced Concepts (Vault, etc.)
12. Roadmap / Vision
13. Status
14. Contributing
15. License

// NOTES:
-- A zero-schema runtime validator powered by TypeScript types
-- Xalor validates runtime data using your existing TypeScript types—no schemas, no duplication.
-- REFECLTING complie-time types into runtime metadata

// PHRASE
-- A runtime type system that extracts and registers TypeScript types at build time
-- shoter A runtime type system powered by build-time TypeScript type extraction

A runtime type system bridging build-time TypeScript types with runtime operations.
