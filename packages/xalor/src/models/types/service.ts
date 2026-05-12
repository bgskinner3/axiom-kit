import type { TVaultSyncPayload } from '../../../transformer/types';

export type TPersistParams = {
  rootDir: string;
  registry: Map<string, TVaultSyncPayload>;
};
