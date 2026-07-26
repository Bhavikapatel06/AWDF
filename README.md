# Developer Portfolio Web Application

A modern, responsive, and premium React portfolio web application built with Vite, CSS3 (glassmorphic theme), and React Router, showcasing modular components, clean routing, and dynamic data fetching.

Developed as part of the **Advanced Web Development Frameworks (AWDF)** course curriculum (Practicals 1, 2, and 3).

---

## 🚀 Features

### Practical 1 & 2: Structure & Design
- **Modular Directory Architecture**: Structured `src/` to separate global `styles`, reusable layout/UI `components` (Navbar, Footer, Header, Skill badges), and route-level `pages` (Home, Projects, Contact).
- **React Routing**: Configured client-side multi-page routing via `react-router-dom` (`/`, `/projects`, `/contact`).
- **Premium Dark-Theme Aesthetics**: Styled with Google Fonts (`Outfit`), custom radial backgrounds, glassmorphic layout panels (`backdrop-filter`), smooth hover actions, and slide-up entrance animations.

### Practical 3: GitHub API Integration (Asynchronous Rendering)
- **API Integration**: Integrates with the public GitHub REST API to fetch and render user repositories dynamically:
  - Endpoint: `https://api.github.com/users/Bhavikapatel06/repos`
- **Asynchronous Lifecycles**:
  - **Loading State**: Displays a custom CSS spinner while a request is pending.
  - **Error Boundary**: Renders an error box when network connection breaks or rate limits occur. Includes a **Retry Connection** button that re-triggers the fetch.
  - **Success State**: Groups and renders fetched repositories as grid cards sorted by stargazers count (highest stars first).
- **Search Filtering**: Real-time searching of repositories by name through a search query input field.
- **Enhanced Card Details**: Each card renders the repository name, star count (★), description, primary programming language tag, and a link pointing directly to its GitHub source.

---

## 🛠️ Technology Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Router**: [React Router Dom 7](https://reactrouter.com/)
- **Styling**: Pure CSS3 with variables, flexbox, CSS grids, and keyframe animations.
- **Linting**: [Oxlint](https://oxc.rs/)

---

## ⚙️ Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

5. **Linter Analysis**:
   ```bash
   npm run lint
   ```
