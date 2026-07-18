import Header1 from "./Header";
import About from "./About";
import Skill from "./Skill";

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