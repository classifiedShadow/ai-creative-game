import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-bold tracking-widest">
          AI ARENA
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        {auth && (
          <>
            <Link to="/" className="hover:text-cyan-300">Home</Link>
            <Link to="/leaderboard" className="hover:text-cyan-300">
              Leaderboard
            </Link>
            {auth.user.isAdmin && (
              <Link to="/admin" className="hover:text-cyan-300">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/60 hover:bg-cyan-500/30"
            >
              Logout
            </button>
          </>
        )}
        {!auth && (
          <>
            <Link to="/login" className="hover:text-cyan-300">Login</Link>
            <Link to="/register" className="hover:text-cyan-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
