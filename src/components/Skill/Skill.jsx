import "./Skill.css";

function Skill({ skillList }) {
    return (
        <section className="skills-container animate-fade-in">
            <h2>Skills</h2>

            <ul className="skills-grid">
                {skillList.map((skill, index) => (
                    <li key={index} className="skill-pill">
                        {skill}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Skill;