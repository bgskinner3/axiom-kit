/**
 * 🗄️ ISOLID REGISTRY
 *
 * The master manifest for all solidified types in the project.
 *
 * This interface acts as an ambient "Shell." The Miner (Transformer)
 * leverages TypeScript's Declaration Merging to dynamically inject
 * string keys and their corresponding TypeScript interfaces here
 * during the build process. This architecture enables zero-import
 * autocomplete and type-safety across the entire workspace.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISolidRegistry {
  /* The Transformer will merge entries here automatically */
}
