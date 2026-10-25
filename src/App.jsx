import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Results from "./pages/Results";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav>
        <Link to="/">მთავარი</Link>
        {user && <Link to="/history">ისტორია</Link>}
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <Link to="/" onClick={logout}>
              გასვლა
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">შესვლა</Link>
            <Link to="/register">რეგისტრაცია</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/:id" element={<Test />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
