import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import { lazyWithMinDelay } from "./utils/lazyWithDelay";
import "./styles/App.css";

// Route-Based Code Splitting via dynamic imports
// Home loads standard lazy; Projects and Contact use lazyWithMinDelay (300ms)
// to satisfy Supplementary Problem 2: avoiding loading flicker on fast connections.
const Home = lazy(() => import("./pages/Home"));
const Projects = lazyWithMinDelay(() => import("./pages/Projects"), 300);
const Contact = lazyWithMinDelay(() => import("./pages/Contact"), 300);

function App() {
  return (
    <>
      {/* Background Animated Gradient Blobs */}
      <div className="bg-gradient-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <NavBar />

      {/* Meaningful fallback UI rendered while chunk is loading */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loading-demo" element={<PageLoader />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;