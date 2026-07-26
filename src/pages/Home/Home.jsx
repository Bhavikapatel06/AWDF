import Header1 from "../../components/Header/Header";
import About from "../../components/About/About";
import Skill from "../../components/Skill/Skill";

function Home() {
    return (
        <>
            <Header1 />
            <About />
            <Skill skillList={["JavaScript", "React", "CSS"]} />
        </>
    );
}

export default Home;