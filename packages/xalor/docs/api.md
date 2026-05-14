> 🚧 **Early Development / Preview Release**
>
> Xalor is currently under active development.
> Some APIs and configuration steps may change before v1.0.
> Expect frequent updates and structural improvements.

# Avliable RuntimeAPIS

I. registerXalor
II. validateXalor
III. generateXalor
IV. transformXalor
mapXalor
mergeXalor
projectXalor
V. buildXalor


---


## 🛡️ Validation API: `validateXalor` Reference

The `validateXalor` API acts as the runtime switchboard for Xalor’s validation engine.

It provides a single polymorphic entry point that translates build-time TypeScript types into runtime validation strategies.

At execution time, the engine routes each payload through a set of specialized validation modes, each optimized for a different safety and performance profile.


| Mode         | Strategy Name           | Return Type                 | Behavior                                                                            | Best Use Case                                             |
| ------------ | ----------------------- | --------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `guard`      | Soft Type Guard         | `TTypeGuard<T>`             | Returns a boolean (`true/false`) after structural validation. No exceptions thrown. | Express/Koa middleware, array filtering, defensive checks |
| `assert`     | Terminal Asserter       | `void`                      | Throws immediately if validation fails (fail-fast execution).                       | Webhooks, env validation, startup safety checks           |
| `parse`      | Synchronous Parser      | `TSolidBranded<T>`          | Validates and returns a branded immutable type instance.                            | DB hydration, config parsing, trusted transforms          |
| `parseAsync` | Promise Parser          | `Promise<TSolidBranded<T>>` | Async validation with safe promise-based rejection flow.                            | Edge functions, message queues, streaming systems         |
| `audit`      | Soft-Fail Diagnostician | `TXalorAuditReport`         | Never throws. Returns full diagnostic report of validation state.                   | Debug UIs, form validation, observability layers          |



| Method    | What it does                                           | Purpose                                    |
| --------- | ------------------------------------------------------ | ------------------------------------------ |
| `map`     | Transforms a value while preserving its shape contract | Normalize or enrich runtime data           |
| `pick`    | Selects a subset of fields from a value                | Create lightweight views (DTOs, UI models) |
| `omit`    | Removes specific fields from a value                   | Strip sensitive or internal data           |
| `flatten` | Converts nested objects into flat structures           | Simplify hierarchical data for processing  |
| `merge`   | Combines multiple objects into one structure           | Aggregate or enrich runtime data           |
| `rename`  | Renames fields in a type-safe transformation           | Align external/internal naming conventions |
| `pipe`    | Chains multiple transformations in sequence            | Build declarative transformation pipelines |



| Method        | What it does                                           | Purpose                             |
| ------------- | ------------------------------------------------------ | ----------------------------------- |
| `extend`      | Adds new fields to an existing registered type         | Create enriched derived types       |
| `pick`        | Builds a new type from selected fields                 | Create lightweight derived schemas  |
| `omit`        | Creates a new type excluding selected fields           | Build safe or stripped variants     |
| `compose`     | Combines multiple registered types into one            | Multi-entity domain modeling        |
| `map`         | Applies a function to derive a new type structure      | Runtime-driven type evolution       |
| `derive`      | Infers and registers a new type from output shape      | Adaptive or dynamic schema creation |
| `alias`       | Creates a new key pointing to an existing type         | Versioning or semantic renaming     |
| `materialize` | Finalizes and commits a derived type into the registry | Persist build-time graph nodes      |
