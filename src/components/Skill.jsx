import "./Skill.css";

const skillsList = ["C", "C++", "Java", "JavaScript", "HTML", "CSS"];

function Skill() {
    return (
        <section className="skills-container animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2>Skills</h2>

            <ul className="skills-grid">
                {skillsList.map((skill, index) => (
                    <li key={index} className="skill-pill">
                        {skill}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Skill;