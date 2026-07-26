import { useState, useEffect } from "react";
import "./Projects.css";

function Spinner() {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
            <p>Fetching repositories from GitHub...</p>
        </div>
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

function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch GitHub repositories
            const response = await fetch("https://api.github.com/users/Bhavikapatel06/repos");
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            
            // Sort repositories by star count descending
            const sortedRepos = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
            setRepos(sortedRepos);
        } catch (err) {
            setError(err.message || "An unexpected network error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    // Filter projects based on query
    const filteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container projects-container">
            <div className="projects-header">
                <h2>Projects</h2>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search projects by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchRepos} />
            ) : (
                <>
                    {filteredRepos.length === 0 ? (
                        <p className="no-repos-text">No repositories match your search criteria.</p>
                    ) : (
                        <ul className="projects-grid">
                            {filteredRepos.map((repo) => (
                                <li key={repo.id} className="project-card">
                                    <div className="project-card-header">
                                        <h3>{repo.name}</h3>
                                        <span className="star-count">
                                            ★ {repo.stargazers_count}
                                        </span>
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
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default Projects;