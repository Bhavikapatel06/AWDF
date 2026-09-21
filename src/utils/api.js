/**
 * Async I/O and Caching Layer for GitHub Repositories
 * Provides non-blocking data fetching, in-memory + sessionStorage caching,
 * request cancellation with AbortController, and background prefetching.
 */

const CACHE_KEY = "portfolio_github_repos";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

// In-memory cache for fast, zero-delay lookups within the same session
let memoryCache = null;
let memoryCacheTimestamp = 0;
let inFlightPromise = null;

/**
 * Checks if the stored cache is still fresh based on CACHE_TTL_MS.
 */
function isCacheValid(timestamp) {
  return timestamp && Date.now() - timestamp < CACHE_TTL_MS;
}

/**
 * Retrieves cached repository data from memory or sessionStorage.
 */
export function getCachedRepos() {
  if (memoryCache && isCacheValid(memoryCacheTimestamp)) {
    return memoryCache;
  }

  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isCacheValid(parsed.timestamp)) {
        memoryCache = parsed.data;
        memoryCacheTimestamp = parsed.timestamp;
        return parsed.data;
      }
    }
  } catch (e) {
    // sessionStorage unavailable or parse error; fallback to network
    console.warn("Async I/O Cache read error:", e);
  }

  return null;
}

/**
 * Saves repository data into memory and sessionStorage.
 */
function setCachedRepos(data) {
  const timestamp = Date.now();
  memoryCache = data;
  memoryCacheTimestamp = timestamp;

  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp })
    );
  } catch (e) {
    console.warn("Async I/O Cache write error:", e);
  }
}

/**
 * Asynchronously fetches GitHub repositories with non-blocking I/O,
 * AbortSignal support, and caching.
 *
 * @param {AbortSignal} [signal] - Optional signal from AbortController
 * @param {boolean} [forceRefresh=false] - Force bypass cache
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos(signal = null, forceRefresh = false) {
  // 1. Check cache first if refresh is not forced
  if (!forceRefresh) {
    const cached = getCachedRepos();
    if (cached) {
      return cached;
    }
  }

  // 2. Dedup concurrent requests (in-flight promise reuse)
  if (inFlightPromise && !forceRefresh) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const response = await fetch("https://api.github.com/users/Bhavikapatel06/repos", {
        signal,
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Sort repositories by star count descending
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => b.stargazers_count - a.stargazers_count)
        : [];

      setCachedRepos(sorted);
      return sorted;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

/**
 * Preload GitHub repository data in the background (Async I/O preloading).
 * Call this on nav hover or idle time so data is instantly available.
 */
export function preloadProjectsData() {
  if (getCachedRepos()) {
    return; // Already cached
  }
  // Trigger non-blocking async fetch in background
  fetchGitHubRepos().catch((err) => {
    console.warn("Background data preloading warning:", err);
  });
}
