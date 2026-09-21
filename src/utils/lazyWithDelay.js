import { lazy } from "react";

/**
 * Wraps a dynamic import with a guaranteed minimum delay.
 * Prevents UI flickering / layout flash on high-speed connections where chunks
 * resolve in a few milliseconds.
 *
 * @param {() => Promise<{ default: React.ComponentType<any> }>} factory - Dynamic import function e.g. () => import('./Component')
 * @param {number} minDelayMs - Minimum time in milliseconds the fallback UI remains visible (default 300ms)
 * @returns {React.LazyExoticComponent<React.ComponentType<any>>}
 */
export function lazyWithMinDelay(factory, minDelayMs = 300) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, minDelayMs)),
    ]).then(([moduleExports]) => moduleExports)
  );
}
