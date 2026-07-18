function Skill({ skillList }) {
    return (
        <section>
            <h2>Skills</h2>

            <ul>
                {skillList.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </section>
    );
}

export default Skill;