import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Nav from "./components/Nav.jsx";
import Guild from "./pages/Guild";
import Leaderboard from "./pages/Leaderboard";
import Quest from "./pages/Quest.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
    };

    apply(mq.matches);

    const handler = (e) => apply(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return (
    <>
      <Nav />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/quest" element={<Quest />} />
        <Route path="/guild" element={<Guild />} />
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;