import { useState } from "react";
import api from "../utils/api.js";

const dummyImage =
  "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=600";

const options = [
  { id: 1, text: "A cyberpunk city at night", score: 90 },
  { id: 2, text: "A quiet village in the morning", score: 30 },
  { id: 3, text: "Abstract neon lights", score: 60 },
  { id: 4, text: "Starry sky over mountains", score: 40 }
];

export default function Stage2() {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    const option = options.find(o => o.id === selected);
    try {
      await api.post("/game/stage2/submit", {
        relevancyScore: option.score
      });
      setMessage(`Submitted with relevancy score ${option.score}.`);
    } catch {
      setMessage("Error submitting.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stage 2 – Guess the Prompt</h2>
      <img
        src={dummyImage}
        alt="Stage2"
        className="w-80 rounded-xl border border-slate-700 mb-4"
      />
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <button
            key={o.id}
            onClick={() => setSelected(o.id)}
            className={`block w-full text-left px-3 py-2 rounded border text-sm ${
              selected === o.id
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            {o.text}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-emerald-500/80 hover:bg-emerald-400 text-slate-900 rounded text-sm"
      >
        Submit Choice
      </button>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
