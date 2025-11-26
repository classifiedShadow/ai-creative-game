import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const res = await api.get("/leaderboard");
    setRows(res.data);
  };

  useEffect(() => {
    load();
    socket.on("leaderboard-update", load);
    return () => socket.off("leaderboard-update", load);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400 tracking-wider">
        Leaderboard
      </h2>

      <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-black/60 backdrop-blur-md">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-right">Stage 1</th>
              <th className="px-4 py-3 text-right">Stage 2</th>
              <th className="px-4 py-3 text-right">Stage 3</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u, idx) => (
              <tr
                key={u._id}
                className="odd:bg-slate-900/40 hover:bg-slate-800 transition"
              >
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2 text-right">{u.score.stage1}</td>
                <td className="px-4 py-2 text-right">{u.score.stage2}</td>
                <td className="px-4 py-2 text-right">{u.score.stage3}</td>
                <td className="px-4 py-2 text-right font-bold text-emerald-400">
                  {u.score.total.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
