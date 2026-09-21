import "./PageLoader.css";

function PageLoader() {
  return (
    <div className="page-loader-wrapper" role="status" aria-live="polite">
      <div className="page-loader-spinner"></div>
      <p className="page-loader-text">Loading page content...</p>
    </div>
  );
}

export default PageLoader;
