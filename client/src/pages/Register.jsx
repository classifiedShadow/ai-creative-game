import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api.js";

export default function Register() {
  const [form, setForm] = useState({
    enrollment: "",
    name: "",
    phone: "",
    username: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-4">Register</h1>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}

        {["enrollment", "name", "phone", "username"].map(key => (
          <label key={key} className="block text-sm mb-2 capitalize">
            {key}
            <input
              name={key}
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
              value={form[key]}
              onChange={handleChange}
            />
          </label>
        ))}

        <p className="text-xs text-slate-400 mb-2">
          Password will be the last 6 digits of your phone.
        </p>
        <button className="mt-2 w-full bg-cyan-500/80 hover:bg-cyan-400 text-slate-900 font-semibold py-2 rounded">
          Register
        </button>
        <p className="mt-3 text-xs text-slate-400">
          Already registered? <Link to="/login" className="text-cyan-300">Login</Link>
        </p>
      </form>
    </div>
  );
}
