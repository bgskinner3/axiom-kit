# Xalor Runtime API

 - A unified interface for validating, generating, transforming, and building Xalor schemas at runtime.


## Table of Contents

1. [registerXalor](#registerxalor)

2. [validateXalor](#validatexalor)
   - [Type Guard Strategy (`guard`)](#i-type-guard-strategy-guard)
   - [Assertion Strategy (`assert`)](#ii-assertion-strategy-assert)
   - [Synchronous Parser (`parse`)](#iii-synchronous-parser-parse)
   - [Async Parser (`parseasync`)](#iv-async-parser-parseasync)
   - [Diagnostic Audit Strategy (`audit`)](#v-diagnostic-audit-strategy-audit)

3. [generateXalor](#generatexalor)
   - [Default Skeleton Strategy (`default`)](#i-default-skeleton-strategy-default)
   - [Mock Generation Strategy (`mock`)](#ii-mock-generation-strategy-mock)
   - [Structural Clone Strategy (`clone`)](#iii-structural-clone-strategy-clone)
   - [Runtime Cast Strategy (`cast`)](#iv-runtime-cast-strategy-cast)


4. [transformXalor](#transformxalor)

5. [buildXalor](#buildxalor)

---

&nbsp;

# Register Xalor

### 🟢 Active

#### Registers a Xalor schema, runtime definition, or type configuration into the active runtime registry.

This method is responsible for:

- linking runtime validators
- attaching generation strategies
- enabling transformation pipelines
- exposing registered schema metadata

---

&nbsp;

# Validate Xalor

### 🟢 Active

#### `validateXalor` supports multiple runtime validation strategies depending on the desired execution model and error-handling behavior.

---

&nbsp;

# I. Type Guard Strategy (`'guard'`)

### Creates a reusable runtime type guard function.

### Behavior

- Returns a `TTypeGuard<T>`
- Performs runtime structural validation
- Returns a boolean result
- Narrows types safely within conditional branches

## Usage

```ts
const isUser = validateXalor<'USER_TEST', 'guard'>();

if (isUser(payload)) {
  console.log(payload.username);
}
```

---

## II. Assertion Strategy (`'assert'`)

### Performs runtime validation and throws immediately on failure.

### Behavior

- Returns `void`
- Throws a validation error if validation fails
- Narrows the validated value downstream after execution

## Usage

```ts
const payload: unknown = getIncomingRequest();

validateXalor<'USER_TEST', 'assert'>(payload);

console.log(payload.id);
```

---

## III. Synchronous Parser (`'parse'`)

### Validates and returns the typed runtime value synchronously.

### Behavior

- Returns validated typed data
- Throws on validation failure
- Supports runtime branding and schema hydration

## Usage

```ts
const user = validateXalor<'USER_TEST', 'parse'>(rawData);
```

---

## IV. Async Parser (`'parseAsync'`)

### Asynchronously validates and resolves typed runtime data.

### Behavior

- Returns `Promise<T>`
- Rejects on validation failure
- Supports async validation pipelines and external resolvers

## Usage

```ts
const user = await validateXalor<'USER_TEST', 'parseAsync'>(networkData);
```

---

## V. Diagnostic Audit Strategy (`'audit'`)

### Produces a structured validation report without throwing.

### Behavior

- Returns a diagnostic result object
- Collects validation issues
- Does not throw
- Useful for tooling, debugging, and reporting pipelines

## Usage

```ts
const report = validateXalor<'USER_TEST', 'audit'>(corruptedData);

if (!report.valid) {
  report.issues.forEach((issue) => {
    console.log(`${issue.path}: ${issue.rule}`);
  });
}
// LOGS:
// {
//   valid: false,
//   issues: [
//     {
//       path: 'username',
//       expected: '{\n  kind: primitive,\n  type: string\n}',
//       received: '"missing"',
//       rule: 'missing_property'
//     }
//   ]
// }
```

&nbsp;

&nbsp;

# Generate XALOR

### 🟢 Active

### `generateXalor` supports multiple runtime generation strategies for creating, cloning, coercing, and simulating typed runtime data structures.

This method supports:

- runtime type validation
- safe parsing
- structured validation errors
- strict or permissive validation modes

---

&nbsp;

## I. Default Skeleton Strategy (`'default'`)

### Creates a clean zero-state object from the registered schema blueprint.

### Behavior

- Generates structurally valid default objects
- Applies primitive fallback values
- Initializes arrays and nested objects
- Returns fully typed runtime-safe structures

## Default Primitive Mapping

| Type      | Default Value |
| --------- | ------------- |
| `string`  | `""`          |
| `number`  | `0`           |
| `boolean` | `false`       |
| `array`   | `[]`          |
| `object`  | `{}`          |

## Usage

```ts
const freshUser = generateXalor<'USER_TEST', 'default'>();
```

---

## II. Mock Generation Strategy (`'mock'`)

### Generates randomized mock data from the registered schema.

### Behavior

- Produces structurally valid randomized objects
- Generates realistic primitive placeholder values
- Randomizes optional field inclusion
- Generates variable collection sizes
- Useful for testing, prototyping, and fixtures

## Usage

```ts
const mockUser = generateXalor<'USER_TEST', 'mock'>();
```

---

## III. Structural Clone Strategy (`'clone'`)

### Creates a deep schema-aligned clone from existing runtime input.

### Behavior

- Removes undeclared properties
- Preserves only schema-defined fields
- Produces clean runtime-safe objects
- Supports circular-safe cloning pipelines

## Usage

```ts
const dirtyInput = {
  id: 1,
  username: 'skinner',
  strayGarbage: 'DROP TABLE Users;',
};

const cleanUser = generateXalor<'USER_TEST', 'clone'>(dirtyInput);
```

---

## IV. Runtime Cast Strategy (`'cast'`)

### Coerces loose runtime values into schema-compatible types.

### Behavior

- Converts compatible primitive values
- Coerces strings into numbers and booleans
- Supports case-insensitive literal alignment
- Wraps compatible singleton values into arrays
- Produces structurally aligned runtime output

## Usage

```ts
const looseInput = {
  id: '5562',
  username: 991,
  active: 'TRUE',
};

const strictUser = generateXalor<'USER_TEST', 'cast'>(looseInput);
```

&nbsp;

&nbsp;

# Transform Xalor

### STATUS - IN PROGRESS

---

&nbsp;

# Build Xalor

### STATUS - IN PROGRESS

