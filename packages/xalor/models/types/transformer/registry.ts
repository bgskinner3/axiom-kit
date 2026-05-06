/**
 * 🗄️ ISOLID REGISTRY
 *
 * The master manifest for all solidified types in the project.
 *
 * This interface is a "Shell." The Miner (Transformer) uses Declaration Merging
 * to inject keys and their corresponding TypeScript interfaces here.
 * This enables ambient autocomplete across the entire workspace.
 */
// //eslint-disable-next-line @typescript-eslint/no-empty-object-type
// export interface ISolidRegistry {
//   /* The Transformer will merge entries here automatically */
//   // [key: string]: unknown;
// }
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISolidRegistry {
  USER_MODEL: { id: number; username: string };
  /* The Transformer will merge entries here automatically */
}
