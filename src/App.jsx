import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Results from "./pages/Results";
import History from "./pages/History";

function App() {
  return (
    <>
      <nav>
        <Link to="/">მთავარი</Link> 
        <Link to="/history">ისტორია</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/:id" element={<Test />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;