import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";

import { StudentProvider } from "./context/StudentContext";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <StudentProvider>

        <div className="app">

          <nav className="navbar">

            <h2>
              Student Management System
            </h2>

            <div className="nav-links">

              <Link to="/">
                Dashboard
              </Link>

              <Link to="/students">
                Students
              </Link>

            </div>

          </nav>

          <main className="page-content">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/students"
                element={<Students />}
              />

            </Routes>

          </main>

        </div>

      </StudentProvider>

    </BrowserRouter>
  );
}

export default App;