import { useEffect, useState } from "react";
import api from "../utils/api.js";

export default function Admin() {
  const [state, setState] = useState(null);
  const [enrollment, setEnrollment] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/game/state");
    setState(res.data.global);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (stage, active) => {
    const res = await api.post("/admin/toggle-stage", { stage, active });
    setState(res.data);
  };

  const resetUser = async () => {
    try {
      await api.post("/admin/reset-user", { enrollment });
      setMsg("User reset");
    } catch {
      setMsg("Error resetting user");
    }
  };

  if (!state) return <div className="text-center text-slate-300">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 tracking-wider">
        Admin Panel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(s => {
          const active = state[`stage${s}Active`];
          return (
            <div
              key={s}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5 text-sm shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all"
            >
              <div className="font-semibold mb-2 text-lg">Stage {s}</div>
              <div className="mb-4">
                Status:{" "}
                <span className={active ? "text-emerald-400" : "text-red-400"}>
                  {active ? "ACTIVE" : "STOPPED"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggle(s, true)}
                  className="px-3 py-1 rounded bg-emerald-500/80 text-black hover:opacity-90 active:scale-95 transition"
                >
                  Start
                </button>
                <button
                  onClick={() => toggle(s, false)}
                  className="px-3 py-1 rounded bg-red-500/80 text-black hover:opacity-90 active:scale-95 transition"
                >
                  Stop
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 text-sm max-w-md shadow-xl">
        <div className="font-semibold text-lg mb-3 text-cyan-300">
          Reset User
        </div>
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-cyan-400"
          placeholder="Enrollment number"
          value={enrollment}
          onChange={e => setEnrollment(e.target.value)}
        />
        <button
          onClick={resetUser}
          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:opacity-90 transition"
        >
          Reset
        </button>
        {msg && <p className="mt-3 text-xs text-slate-300">{msg}</p>}
      </div>
    </div>
  );
}
