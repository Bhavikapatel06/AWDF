import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense, memo } from "react";
import { fetchGitHubRepos, getCachedRepos } from "../utils/api";
import "./Projects.css";

// Supplementary Problem: Lazy loading a heavy on-demand sub-component (Analytics & Chart)
const ProjectAnalytics = lazy(() => import("../components/ProjectAnalytics"));

function SkeletonGrid() {
  return (
    <ul className="projects-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <li key={i} className="project-card skeleton-card">
          <div className="skeleton-shimmer skeleton-title"></div>
          <div className="skeleton-shimmer skeleton-line"></div>
          <div className="skeleton-shimmer skeleton-line-short"></div>
          <div className="project-card-footer">
            <div className="skeleton-shimmer skeleton-tag"></div>
            <div className="skeleton-shimmer skeleton-link"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <h3>Unable to Load Projects</h3>
      <p className="error-text">{message}</p>
      <button className="retry-button" onClick={onRetry}>
        Retry Connection
      </button>
    </div>
  );
}

// React DevTools Profiler Optimization: Memoized ProjectCard prevents redundant re-renders
const ProjectCard = memo(function ProjectCard({ repo }) {
  return (
    <li className="project-card animate-fade-in">
      <div className="project-card-header">
        <h3>{repo.name}</h3>
        {repo.stargazers_count > 0 && (
          <span className="star-count">★ {repo.stargazers_count}</span>
        )}
      </div>
      <p>{repo.description || "No description provided."}</p>
      <div className="project-card-footer">
        <span className="project-tag">
          {repo.language || "GitHub"}
        </span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="view-github-link"
        >
          View on GitHub →
        </a>
      </div>
    </li>
  );
});

function Projects() {
  const [repos, setRepos] = useState(() => getCachedRepos() || []);
  const [loading, setLoading] = useState(() => !getCachedRepos());
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(() => !!getCachedRepos());
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const abortControllerRef = useRef(null);

  const loadRepos = useCallback(async (forceRefresh = false) => {
    // Abort previous in-flight request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchGitHubRepos(controller.signal, forceRefresh);
      setRepos(data);
      setIsFromCache(!forceRefresh && !!getCachedRepos());
    } catch (err) {
      if (err.name === "AbortError") {
        return; // Request was aborted cleanly on unmount/re-fetch
      }
      setError(err.message || "An unexpected network error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepos(false);
    return () => {
      // Clean up async I/O on component unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadRepos]);

  // Profiler Optimization: Memoize filtered repository list
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [repos, searchQuery]);

  return (
    <div className="container projects-container">
      <div className="projects-header">
        <div className="projects-title-group">
          <h2>Projects</h2>
          {isFromCache && !loading && (
            <span className="cache-badge" title="Data served instantly from memory/session cache">
              <span className="cache-dot"></span> Async Cached
            </span>
          )}
        </div>

        <div className="projects-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="refresh-btn"
            onClick={() => setShowAnalytics((prev) => !prev)}
            title="Toggle lazy-loaded analytics component"
          >
            {showAnalytics ? "Hide Analytics" : "📊 Analytics"}
          </button>
          <button
            className="refresh-btn"
            onClick={() => loadRepos(true)}
            title="Bypass cache and re-fetch from GitHub API"
            disabled={loading}
          >
            {loading ? "Fetching..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Supplementary: Lazy-loaded heavy chart component */}
      {showAnalytics && (
        <Suspense
          fallback={
            <div className="analytics-skeleton" role="status">
              Loading Repository Analytics Chunk...
            </div>
          }
        >
          <ProjectAnalytics repos={repos} />
        </Suspense>
      )}

      {loading && repos.length === 0 ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => loadRepos(true)} />
      ) : (
        <>
          {filteredRepos.length === 0 ? (
            <p className="no-repos-text">No repositories match your search criteria.</p>
          ) : (
            <ul className="projects-grid">
              {filteredRepos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Projects;