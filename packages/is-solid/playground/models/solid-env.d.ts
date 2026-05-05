/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */
import type { TSolid } from './index';

declare module 'is-solid' {
  export function isSolid(data: unknown): data is TSolid<'PROFILE_API', any>;
  export function isSolid(data: unknown): data is TSolid<'PROFILE', any>;
  export function isSolid(data: unknown): data is TSolid<'USER', any>;
}
