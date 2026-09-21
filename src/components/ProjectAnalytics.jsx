import { useMemo } from "react";
import "./ProjectAnalytics.css";

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  TypeScript: "#3178c6",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Other: "#8b949e",
};

function ProjectAnalytics({ repos = [] }) {
  const stats = useMemo(() => {
    if (!repos.length) return null;

    const totalStars = repos.reduce(
      (acc, r) => acc + (r.stargazers_count || 0),
      0
    );
    const langCounts = {};

    repos.forEach((r) => {
      const lang = r.language || "Other";
      langCounts[lang] = (langCounts[lang] || 0) + 1;
    });

    const sortedLangs = Object.entries(langCounts)
      .map(([lang, count]) => ({
        lang,
        count,
        percentage: Math.round((count / repos.length) * 100),
        color: LANGUAGE_COLORS[lang] || "#6366f1",
      }))
      .sort((a, b) => b.count - a.count);

    const topProject = [...repos].sort(
      (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
    )[0];

    return {
      totalRepos: repos.length,
      totalStars,
      topProject,
      sortedLangs,
    };
  }, [repos]);

  if (!stats) return null;

  return (
    <section className="analytics-card animate-fade-in" aria-label="Project Analytics">
      <div className="analytics-header">
        <div>
          <span className="analytics-pill">Dynamic Lazy Component</span>
          <h3 className="analytics-title">Repository Analytics & Distribution</h3>
        </div>
        <p className="analytics-subtitle">
          Code-split sub-component loaded on-demand to optimize initial route execution
        </p>
      </div>

      <div className="analytics-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Total Repositories</span>
          <span className="metric-value">{stats.totalRepos}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Stargazers Count</span>
          <span className="metric-value">★ {stats.totalStars}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Primary Language</span>
          <span className="metric-value">
            {stats.sortedLangs[0]?.lang || "N/A"}
          </span>
        </div>
      </div>

      <div className="analytics-chart-section">
        <h4 className="chart-heading">Technology & Language Breakdown</h4>
        <div className="language-bar-track">
          {stats.sortedLangs.map((item) => (
            <div
              key={item.lang}
              className="language-bar-segment"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.lang}: ${item.count} (${item.percentage}%)`}
            />
          ))}
        </div>

        <ul className="language-legend-list">
          {stats.sortedLangs.map((item) => (
            <li key={item.lang} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="legend-name">{item.lang}</span>
              <span className="legend-percent">{item.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProjectAnalytics;
