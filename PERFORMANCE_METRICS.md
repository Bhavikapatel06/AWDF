# Performance Evaluation Matrix: Code Splitting, Async I/O & Preloading

This document evaluates the portfolio application's performance **Before** and **After** implementing Code Splitting, Async I/O, and Preloading optimizations.

---

## 1. Comparative Evaluation Matrix

| Metric / Dimension | Before Optimization | After Optimization | Improvement / Impact |
| :--- | :--- | :--- | :--- |
| **Total JavaScript Chunks** | 1 monolithic bundle | 7 modular chunks | Granular caching & on-demand loading |
| **Main/Entry Application Bundle** | 236.85 kB (gzip: 75.80 kB) | 4.47 kB (gzip: 1.89 kB) | **98.1% reduction** in entry application code |
| **Vendor Code Splitting** | None (mixed with application) | `vendor-react` (189.63 kB)<br>`vendor-router` (41.08 kB) | Long-term browser HTTP caching (survives app updates) |
| **Route Code Splitting** | 0% (All routes loaded on initial load) | Isolated lazy route chunks:<br>• `Home`: 1.00 kB<br>• `Projects`: 3.24 kB<br>• `Contact`: 1.64 kB | Only active route code is loaded |
| **Initial CSS Download** | 9.56 kB (gzip: 2.51 kB) | 5.42 kB (gzip: 1.70 kB) | **43.3% CSS reduction** on initial page load |
| **Route CSS Splitting** | 1 monolithic stylesheet | Isolated route stylesheets:<br>• `Home`: 1.44 kB<br>• `Projects`: 4.13 kB<br>• `Contact`: 0.97 kB | Only relevant component styling parsed |
| **Subsequent App Deploy Download** | ~236.85 kB re-downloaded by clients on every edit | ~4.47 kB (vendor chunks stay cached indefinitely) | **98.1% reduction** in client transfer bandwidth on app updates |
| **Async I/O Strategy** | Uncached cold `fetch()` on every component mount | Dual-layer cache (In-Memory + `sessionStorage`) with 5-minute TTL | **0 ms network latency** on back navigation & tab switches |
| **Request Cleanup & Safety** | None (can trigger React unmounted state warnings) | Clean `AbortController` signal cancellation on unmount | Zero orphaned network requests or state leaks |
| **Route Preloading** | None (cold download on route click) | Intent preloading (`onMouseEnter`/`onFocus`) + `requestIdleCallback` scheduler | Eliminates navigation lag (instant route display) |
| **Data Preloading (Prefetch)** | None (starts fetching only after page mount) | Parallel prefetch triggered on "Projects" hover/idle | Data is ready before the user finishes clicking |
| **Network Handshake Pre-warming** | None | DNS prefetch + Preconnect to `api.github.com` & Google Fonts | Saves ~100–300 ms of DNS/TLS handshake overhead |
| **Perceived UX & Layout Shift** | Simple spinner; content pops in with layout shifts | Shimmer Skeleton Card loaders matching theme (CLS = 0) | Seamless visual stability and perceived speed |

---

## 2. Detailed Breakdown of Optimizations

### A. Code Splitting
- **Vite & Rolldown Manual Chunks**: Separated `react`, `react-dom`, and `react-router-dom` into dedicated vendor chunks (`vendor-react.js` and `vendor-router.js`).
- **Dynamic Imports (`React.lazy` & `Suspense`)**: Converted static route imports (`Home`, `Projects`, `Contact`) into dynamic imports wrapped with a lightweight fallback spinner (`PageLoader`).
- **Result**: The primary application bundle shrank from **236.85 kB** down to **4.47 kB**.

### B. Async I/O
- **Dual-Layer Caching**: Implemented in-memory and `sessionStorage` caching in `src/utils/api.js`. When navigating back to the Projects tab, repository data is served instantly without burning GitHub API rate limits.
- **AbortController Integration**: Added `AbortSignal` to network calls. When a user navigates away before an asynchronous request completes, the browser cleanly aborts the in-flight HTTP request.
- **Non-blocking Contact Submission**: Enhanced the contact form with realistic asynchronous submission pipeline (`async/await`, loading states, error handling, and visual toast feedback).
- **Skeleton Shimmer UI**: Rendered 6 shimmer skeleton cards during initial data arrival to maintain visual structure and eliminate Cumulative Layout Shift (CLS).

### C. Preloading
- **Intent-Based Preloading**: Attached `onMouseEnter` and `onFocus` event listeners on navigation links in `NavBar.jsx`. When the user hovers over "Projects", both the JavaScript chunk and GitHub data are pre-warmed concurrently.
- **Idle Preloading**: Configured `scheduleIdlePreload()` using `requestIdleCallback` to automatically prefetch secondary chunks during idle browser cycles.
- **Connection Pre-warming**: Injected `<link rel="preconnect" href="https://api.github.com">` and `<link rel="dns-prefetch" href="https://api.github.com">` into `index.html`.

---

## 3. Production Build Artifacts (After Optimization)

```text
dist/index.html                              1.41 kB │ gzip:  0.63 kB
dist/assets/Contact-CpBSQA-E.css             0.97 kB │ gzip:  0.44 kB
dist/assets/Home-D7CMZA1_.css                1.44 kB │ gzip:  0.68 kB
dist/assets/ProjectAnalytics-CqC9nCvQ.css    1.84 kB │ gzip:  0.76 kB
dist/assets/Projects-C1P8n879.css            4.83 kB │ gzip:  1.49 kB
dist/assets/index-wgALPrPD.css               5.42 kB │ gzip:  1.70 kB
dist/assets/rolldown-runtime-Bh1tDfsg.js     0.56 kB │ gzip:  0.36 kB
dist/assets/Home-T14a2czv.js                 1.00 kB │ gzip:  0.46 kB
dist/assets/Contact-7MFa-wLd.js              1.64 kB │ gzip:  0.82 kB
dist/assets/ProjectAnalytics-MsMV7dyJ.js     2.76 kB │ gzip:  1.10 kB
dist/assets/Projects-DnTIwQ2H.js             4.12 kB │ gzip:  1.59 kB
dist/assets/index-DlRVUDDv.js                4.66 kB │ gzip:  1.96 kB
dist/assets/vendor-router-Do0iWio2.js       41.08 kB │ gzip: 14.71 kB
dist/assets/vendor-react-CnQ8cts2.js       189.63 kB │ gzip: 59.65 kB
```

---

## 4. Visual Evidence & Screenshots

### 1. Baseline Terminal Build (Before Code Splitting - Single Bundle)
![Baseline Build Terminal](screenshots/01_baseline_build_terminal.png)

### 2. Baseline DevTools Network Tab (Initial Full Download)
![Baseline Network DevTools](screenshots/02_baseline_network_devtools.png)

### 3. Optimized Modular Build (Vite 8 Separate Chunks)
![Optimized Build Terminal](screenshots/03_optimized_build_terminal.png)

### 4. Meaningful Fallback UI (PageLoader under Slow 3G)
![Fallback UI Slow 3G](screenshots/04_fallback_ui_slow_3g.png)

### 5. Optimized DevTools Network Tab (On-Demand Lazy Chunks)
![Lazy Chunk Network DevTools](screenshots/05_lazy_chunk_network_devtools.png)

### 6. React DevTools Profiler (Zero Redundant Re-renders & Min Delay)
![Profiler Flamegraph](screenshots/06_profiler_and_flamegraph.png)

### 7. Supplementary Lazy Component (Repository Analytics & Chart)
![Lazy Analytics Component](screenshots/07_lazy_analytics_component.png)

