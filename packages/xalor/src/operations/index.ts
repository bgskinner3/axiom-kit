export * from './core';
export * from './construction';

/**
 * FUNCTIONS TO ADD
 * II.getSolidMock<T>(key)
 *  - The Faker: Generates an object with randomized valid data. Essential for unit tests and prototyping.
 *
 * III.getSolidSchema(key)
 *  - he Translator: Converts the internal TSolidShape into other formats (like JSON Schema or Zod) for ecosystem compatibility.
 *
 * ----
 * IV.clearSolidVault()
 *  - The Janitor: Wipes all registered types and errors. Critical for HMR and testing environments.
 *
 * V. exportSolidDatabase()
 *  - The Porter: Dumps the entire Vault into a serializable JSON object. Allows you to "save" the state of your types to a file.
 *
 * VI. importSolidDatabase(json)
 *  - The Rehydrator: Loads a previously exported JSON database into the live Vault.
 *
 * ---
 *  VI. isSolidEqual<K>(a, b)
 *   -The Deep Comparison: Checks if two objects are structurally identical based on the registered blueprint.
 *
 * VII.patchSolid<K, T>(data, partial)
 *  - The Safe Merger: Merges a partial object into an existing one, ensuring the final result still satisfies the blueprint.
 *
 * VIII. matchSolid<K>(data, handlers)
 *  - The Pattern Matcher: A functional "Switch" statement that executes different code paths based on which Solid Type the data matches.
 */
/**
 *
 * -----IDEAS-----
 * --- a funtions that handles type declerations ?
 * ----what other featues shoudl be tied to this ?
 */
