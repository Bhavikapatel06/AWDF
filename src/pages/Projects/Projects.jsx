import "./Projects.css";

const projectList = [
    {
        title: "Portfolio Website",
        description: "A beautiful, premium developer portfolio styled with glassmorphism, responsive grids, and animations.",
        tags: ["React", "Vite", "CSS3"]
    },
    {
        title: "Student Management System",
        description: "An administrative panel designed to catalog student databases, schedule classes, and manage records.",
        tags: ["JavaScript", "React", "NodeJS"]
    },
    {
        title: "Weather App",
        description: "A real-time weather tracking application utilizing open APIs, featuring dynamic backgrounds and micro-states.",
        tags: ["React", "REST API", "CSS"]
    }
];

function Projects() {
    return (
        <div className="container projects-container">
            <h2>Projects</h2>

            <ul className="projects-grid">
                {projectList.map((project, index) => (
                    <li key={index} className="project-card">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <ul className="project-tags">
                            {project.tags.map((tag, tagIndex) => (
                                <li key={tagIndex} className="project-tag">{tag}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Projects;