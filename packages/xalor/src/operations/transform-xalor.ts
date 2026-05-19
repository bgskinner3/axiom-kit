/**
 * ============================================================================
 * 🧬 TRANSFORM XALOR API STRATEGY SPECIFICATIONS
 * ============================================================================
 *
 * ROLE:
 * The "Evolution Pillar." Acts as the centralized structural data morphing matrix
 * of the ecosystem. It takes a verified source data object and progressively translates
 * its properties into an entirely new destination format or subtyping view representation.
 *
 * DESIGN INVARIANTS:
 * - Governed by COMMANDMENT III (Zero-Footprint Runtime) and COMMANDMENT IV
 *   (Operation Isolation). The build-time transformer intercepts this call, strips out
 *   the generic parameters, and injects literal string keys directly into
 *   the production JavaScript parameters slot, bypassing heavy type graph reifications during builds.
 * - Enforces absolute ZERO 'any' variables, ZERO manual type assertions ('as'), and
 *   ZERO procedural 'switch' or conditional 'if/else' loop branching blocks. All mutations
 *   route polymorphically through an immutable strategy object lookup dictionary map.
 *
 * STRATEGY MODES REGISTRY:
 *
 * I. SELECTIVE RETENTION ('pick')
 * - WHAT IT DOES:
 *   Generates a lightweight, stripped object containing *only* the specific blueprint properties requested.
 * - HOW IT WORKS:
 *   Iterates directly through the structural field checklist passed in the options array.
 *   If a property passes validation against the master schema blueprint, it is cloned into the output model;
 *   all unlisted keys are physically erased from memory cache layers.
 * - APPLICATION:
 *   Ideal for constructing safe Data Transfer Objects (DTOs), API transport fragments, or specialized UI view frames.
 * - TRACE TRUCKING EXPERIENCES:
 *   @example
 *   ```ts
 *   // 1. Source Context Structure Type:
 *   // ISolidRegistry['USER_PROFILE'] = { id: number; email: string; phone: string; role: string; token: string; }
 *
 *   const rawUser = { id: 101, email: 'brennan@xalor.io', phone: '555-0192', role: 'admin', token: 'jwt_991' };
 *
 *   // 2. Pre-Compiled Syntax Call:
 *   const publicContact = transformXalor<'USER_PROFILE', 'USER_PROFILE'>('USER_PROFILE', 'USER_PROFILE', rawUser, 'pick', ['email', 'phone']);
 *
 *   // 3. Post-Compiled Runtime Execution Vector:
 *   // transformXalor('USER_PROFILE', 'USER_PROFILE', rawUser, 'pick', ['email', 'phone'])
 *
 *   // 4. Returned / Logged Output Object Graph:
 *   console.log(publicContact);
 *   // {
 *   //   email: 'brennan@xalor.io',
 *   //   phone: '555-0192'
 *   // }
 *   ```
 *
 * II. STRUCTURAL EXCLUSION ('omit')
 * - WHAT IT DOES:
 *   Generates an exact structural match of the parent type while explicitly stripping away targeted keys.
 * - HOW IT WORKS:
 *   Maps the authoritative properties list of the blueprint but checks an omission checklist.
 *   If a property key name matches a restricted modifier token, it is intercepted and skipped,
 *   preventing confidential information from leaking past system borders.
 * - APPLICATION:
 *   Crucial for purging sensitive attributes (like password hashes, salts, or internal tracking IDs) prior
 *   to sending data packages down to client-side frontend browser bundles.
 * - TRACE TRUCKING EXPERIENCES:
 *   @example
 *   ```ts
 *   // 1. Source Context Structure Type:
 *   // ISolidRegistry['USER_PROFILE'] = { id: number; email: string; phone: string; role: string; token: string; }
 *
 *   const rawUser = { id: 101, email: 'brennan@xalor.io', phone: '555-0192', role: 'admin', token: 'jwt_991' };
 *
 *   // 2. Pre-Compiled Syntax Call:
 *   const safeUser = transformXalor<'USER_PROFILE', 'USER_PROFILE'>('USER_PROFILE', 'USER_PROFILE', rawUser, 'omit', ['token', 'role']);
 *
 *   // 3. Post-Compiled Runtime Execution Vector:
 *   // transformXalor('USER_PROFILE', 'USER_PROFILE', rawUser, 'omit', ['token', 'role'])
 *
 *   // 4. Returned / Logged Output Object Graph:
 *   console.log(safeUser);
 *   // {
 *   //   id: 101,
 *   //   email: 'brennan@xalor.io',
 *   //   phone: '555-0192'
 *   // }
 *   ```
 *
 * III. NOMINAL ALIGNMENT ('rename')
 * - WHAT IT DOES:
 *   Symmetrically maps property keys from one lexicon convention to match another in a type-safe manner.
 * - HOW IT WORKS:
 *   Processes the incoming data layout using a flat key translation lookup dictionary configuration object.
 *   As it clones attributes, keys matching a dictionary rule are renamed to their destination target values,
 *   while the nested property shape values undergo a safe recursive type coercion cast loop pass.
 * - APPLICATION:
 *   Perfect for mapping data across integration borders (e.g. converting third-party external `snake_case` network
 *   payload variables into native internal application `camelCase` parameters).
 * - TRACE TRUCKING EXPERIENCES:
 *   @example
 *   ```ts
 *   // 1. Source Context Structure Types:
 *   // ISolidRegistry['EXTERNAL_PAYLOAD'] = { external_id: string; user_name: string; is_verified: string; }
 *   // ISolidRegistry['INTERNAL_USER']    = { id: number; username: string; active: boolean; }
 *
 *   const networkInput = { external_id: '8842', user_name: 'neon_rider', is_verified: 'TRUE' };
 *
 *   // 2. Pre-Compiled Syntax Call:
 *   const formattedData = transformXalor<'EXTERNAL_PAYLOAD', 'INTERNAL_USER'>('EXTERNAL_PAYLOAD', 'INTERNAL_USER', networkInput, 'rename', { external_id: 'id', user_name: 'username', is_verified: 'active' });
 *
 *   // 3. Post-Compiled Runtime Execution Vector:
 *   // transformXalor('EXTERNAL_PAYLOAD', 'INTERNAL_USER', networkInput, 'rename', { external_id: 'id', user_name: 'username', is_verified: 'active' })
 *
 *   // 4. Returned / Logged Output Object Graph (Fully coerced and mapped to destination contracts):
 *   console.log(formattedData);
 *   // {
 *   //   id: 8842,
 *   //   username: 'neon_rider',
 *   //   active: true
 *   // }
 *   ```
 *
 * IV. MATRIX DECOMPRESSION ('flatten')
 * - WHAT IT DOES:
 *   Flattens deeply nested hierarchical data structures down into flat, single-layer object records.
 * - HOW IT WORKS:
 *   Recursively walks object and array property nodes, using a dot-notation breadcrumb builder loop.
 *   It collapses nested parent-child matrices into individual root-level keys (e.g., transforming `address: { zip: "10001" }`
 *   directly into a single property key string `"address.zip": "10001"`).
 * - APPLICATION:
 *   Essential for preparing composite structural data graphs for flat output streams like CSV logs, analytical index trackers,
 *   or relational database record insertions.
 * - TRACE TRUCKING EXPERIENCES:
 *   @example
 *   ```ts
 *   // 1. Source Context Structure Types:
 *   // ISolidRegistry['STORE_ORDER']     = { orderId: string; meta: { timestamp: number }; items: { SKU: string }[]; }
 *   // ISolidRegistry['FLAT_ORDER_VIEW'] = Record<string, string | number>;
 *
 *   const nestedOrder = {
 *     orderId: 'ORD-991',
 *     meta: { timestamp: 1715974000 },
 *     items: [{ SKU: 'XAL-CORE' }]
 *   };
 *
 *   // 2. Pre-Compiled Syntax Call:
 *   const flatRecord = transformXalor<'STORE_ORDER', 'FLAT_ORDER_VIEW'>('STORE_ORDER', 'FLAT_ORDER_VIEW', nestedOrder, 'flatten');
 *
 *   // 3. Post-Compiled Runtime Execution Vector:
 *   // transformXalor('STORE_ORDER', 'FLAT_ORDER_VIEW', nestedOrder, 'flatten')
 *
 *   // 4. Returned / Logged Output Object Graph:
 *   console.log(flatRecord);
 *   // {
 *   //   "orderId": "ORD-991",
 *   //   "meta.timestamp": 1715974000,
 *   //   "items[0].SKU": "XAL-CORE"
 *   // }
 *   ```
 */
