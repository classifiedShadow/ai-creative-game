import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { enrollment, password });
      login(res.data);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-widest mb-6 text-center">
          LOGIN
        </h1>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-cyan-300/70">
              Enrollment Number
            </label>
            <input
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              value={enrollment}
              onChange={e => setEnrollment(e.target.value)}
              placeholder="Enter your enrollment number"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-cyan-300/70">
              Password (last 6 digits of phone)
            </label>
            <input
              type="password"
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 rounded-xl bg-cyan-500 text-slate-900 font-bold tracking-wider hover:bg-cyan-400 transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          >
            LOGIN
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
