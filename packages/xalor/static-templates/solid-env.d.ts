/**
 * 🛰️ XALOR AUTOMATED GHOST TYPE DECLARATIONS (BASELINE TEMPLATE)
 *
 * ROLE:
 * Eliminates the "Cold-Start" IDE module import error on initial installations.
 * This structure is dynamically overwritten by the Miner on your first file save.
 */
/* eslint-disable @typescript-eslint/no-unused-vars @typescript-eslint/no-explicit-any */
import type {
  TSolidMetadata,
  ISolidRegistry,
  ISolidIdentity,
} from '@bgskinner2/xalor';

declare module '@bgskinner2/xalor' {
  interface ISolidIdentity {
    // Open catch-all signature ensures the IDE allows lookups before first compilation flushes
    [key: string]: string | undefined;
  }

  interface ISolidRegistry {
    // Open catch-all signature ensures the IDE provides autocomplete support for dynamic keys
    [key: string]: {};
  }
}
