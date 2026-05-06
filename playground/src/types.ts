import { isSolid } from 'xalor';

export interface IProfile {
  username: string;
  tags: string[];
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

/**
 * 💎 PILLAR 1: THE MINER
 * Registering the profile type. This will update 'models/solid-env.d.ts'
 * and allow 'api.ts' to use it without an interface import.
 */
isSolid<'PROFILE', IProfile>();
export type User = {
  id: string;
  age: number;
};

// // 💎 Seed the Vault
// isSolid<'USER', User>();
