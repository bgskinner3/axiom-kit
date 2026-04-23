/**
 * Local alias for the native DOM ScrollLogicalPosition.
 * This resolves the ESLint 'no-undef' error and ensures
 * compatibility across different TS configurations.
 */
type TScrollLogicalPosition = 'center' | 'end' | 'start' | 'nearest';

type TScrollBehavior = 'auto' | 'smooth';

export type THashScrollOptions = {
  href: string;
  behavior?: TScrollBehavior;
  block?: TScrollLogicalPosition;
  event?: { preventDefault: () => void };
};
export type TGenericUrlObject = {
  pathname?: string | null;
  query?: Record<
    string,
    string | number | boolean | string[] | undefined
  > | null;
  hash?: string | null;
  [key: string]: unknown;
};
