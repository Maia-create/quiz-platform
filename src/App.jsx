import { Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Avatar from "./components/Avatar";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Results from "./pages/Results";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const year = new Date().getFullYear();

function App() {
  const { user } = useAuth();

  return (
    <>
      <nav>
        <Link to="/" className="nav-brand">
          QUIZ_
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>
            მთავარი
          </NavLink>
          {user ? (
            <NavLink to="/history">ისტორია</NavLink>
          ) : (
            <>
              <NavLink to="/login">შესვლა</NavLink>
              <NavLink to="/register">რეგისტრაცია</NavLink>
            </>
          )}
        </div>

        {user && (
          <NavLink to="/profile" className="nav-profile" title="პროფილი">
            <Avatar user={user} size={30} />
            <span className="nav-name">{user.name}</span>
          </NavLink>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/:id" element={<Test />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />}/>
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <footer>
        <span>© {year} QUIZ_</span>
        <span className="footer-sep">·</span>
        <span>© მაია იმერლიშვილი</span>
      </footer>
    </>
  );
}

export default App;
