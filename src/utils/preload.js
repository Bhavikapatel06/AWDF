/**
 * Preloading Strategies for Routes and Resources
 * Provides intent-based preloading (on hover/focus) and idle-time preloading.
 */

import { preloadProjectsData } from "./api";

// Route chunk preloading functions
export const preloadHome = () => import("../pages/Home");
export const preloadProjects = () => {
  // Preload both the component chunk and the async data simultaneously!
  preloadProjectsData();
  return import("../pages/Projects");
};
export const preloadContact = () => import("../pages/Contact");

/**
 * Preloads all lazy routes during browser idle periods so that subsequent
 * page navigations are 100% instant with zero network wait time.
 */
export function scheduleIdlePreload() {
  const runPreload = () => {
    preloadProjects();
    preloadContact();
  };

  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(runPreload, { timeout: 2500 });
    } else {
      setTimeout(runPreload, 2000);
    }
  }
}
