import type { TVaultSyncPayload } from '../../models/types';

export type TPersistParams = {
  rootDir: string;
  registry: Map<string, TVaultSyncPayload>;
};
