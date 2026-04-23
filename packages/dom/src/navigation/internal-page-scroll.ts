import type { THashScrollOptions } from './types';
/**
 * @utilType util
 * @name handleInternalHashScroll
 * @category Dom Media
 * @description Manages smooth scrolling for internal hash links with SSR safety and a fallback for legacy browsers.
 * @link #handleinternalhashscroll
 *
 * ---
 *
 * ## ⚓ handleInternalHashScroll — Smooth Fragment Navigation
 *
 * Intercepts link clicks to perform smooth, accessible scrolling to page fragments.
 * 1. Handles `#` and `#top` by scrolling to the absolute top of the viewport.
 * 2. Uses `scrollIntoView` with a `try/catch` fallback for older browser engines.
 * 3. Prevents default browser behavior only if a valid target is found.
 *
 * ---
 *
 * @param options - Configuration including the href, scroll behavior, and the trigger event.
 * @returns `true` if the scroll was handled, otherwise `false`.
 */
export const handleInternalHashScroll = ({
  event,
  href,
  behavior = 'smooth',
  block = 'start',
}: THashScrollOptions): boolean => {
  if (typeof window === 'undefined' || !href?.startsWith('#')) return false;

  // 2. Handle "Scroll to Top" (# or #top)
  if (href === '#' || href === '#top') {
    event?.preventDefault();
    window.scrollTo({ top: 0, behavior });
    return true;
  }

  // 3. Resolve Target Element
  const id = href.slice(1);
  const element = document.getElementById(id);
  if (!element) return false;

  // 4. Execution
  event?.preventDefault();

  try {
    element.scrollIntoView({ behavior, block });
  } catch {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior });
  }

  return true;
};
