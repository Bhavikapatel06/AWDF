import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  preloadHome,
  preloadProjects,
  preloadContact,
  scheduleIdlePreload,
} from "../utils/preload";

function NavBar() {
  useEffect(() => {
    // Schedule preloading of lazy route chunks during idle browser cycles
    scheduleIdlePreload();
  }, []);

  return (
    <nav role="navigation" aria-label="Main Navigation">
      <Link
        to="/"
        onMouseEnter={preloadHome}
        onFocus={preloadHome}
      >
        Home
      </Link>{" "}
      |{" "}
      <Link
        to="/projects"
        onMouseEnter={preloadProjects}
        onFocus={preloadProjects}
      >
        Projects
      </Link>{" "}
      |{" "}
      <Link
        to="/contact"
        onMouseEnter={preloadContact}
        onFocus={preloadContact}
      >
        Contact
      </Link>
    </nav>
  );
}

export default NavBar;