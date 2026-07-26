import Header1 from "../components/Header";
import About from "../components/About";
import Skill from "../components/Skill";

function Home() {
    return (
        <div className="home-container animate-fade-in">
            <Header1 />
            <About />
            <Skill />
        </div>
    );
}

export default Home;