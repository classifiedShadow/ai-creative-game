import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import GameHub from "./pages/GameHub.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Admin from "./pages/Admin.jsx";
import Stage1 from "./pages/Stage1.jsx";
import Stage2 from "./pages/Stage2.jsx";
import Stage3 from "./pages/Stage3.jsx";

const Protected = ({ children, adminOnly = false }) => {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;

  // 🔓 DEV BYPASS (temporary)
  if (adminOnly) {
    return children;
  }

  return children;
};


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-4">
        <Routes>
          <Route path="/" element={
            <Protected><GameHub /></Protected>
          }/>
          <Route path="/stage1" element={
            <Protected><Stage1 /></Protected>
          }/>
          <Route path="/stage2" element={
            <Protected><Stage2 /></Protected>
          }/>
          <Route path="/stage3" element={
            <Protected><Stage3 /></Protected>
          }/>
          <Route path="/leaderboard" element={
            <Protected><Leaderboard /></Protected>
          }/>
          <Route path="/admin" element={
            <Protected adminOnly><Admin /></Protected>
          }/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
