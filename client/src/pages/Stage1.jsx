import { useState } from "react";
import api from "../utils/api.js";

export default function Stage1() {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (generated.length >= 3) {
      setMessage("Generation limit reached (3).");
      return;
    }
    const res = await api.post("/game/stage1/generate", { prompt });
    setGenerated(g => [...g, res.data.imageUrl]);
  };

  const handleSubmit = async () => {
    if (!finalImage) return;
    try {
      await api.post("/game/stage1/submit", {
        prompt,
        imageUrl: finalImage
      });
      setMessage("Stage 1 submitted! You can now vote on others.");
    } catch (e) {
      setMessage(e.response?.data?.message || "Submit failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stage 1 – Text to Image</h2>
      <p className="text-xs text-slate-400 mb-3">
        Theme will be given by organizers. Use your own original prompt.
      </p>
      <textarea
        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm mb-2"
        rows={3}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Type your creative prompt..."
      />
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleGenerate}
          className="px-3 py-1 bg-cyan-500/80 hover:bg-cyan-400 text-slate-900 rounded text-sm"
        >
          Generate
        </button>
      </div>
      {generated.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {generated.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setFinalImage(url)}
              className={`border rounded overflow-hidden cursor-pointer ${
                finalImage === url ? "border-cyan-400" : "border-slate-700"
              }`}
            >
              <img src={url} alt="" className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!finalImage}
        className="px-4 py-2 bg-emerald-500/80 hover:bg-emerald-400 text-slate-900 rounded text-sm disabled:opacity-40"
      >
        Submit Final Image
      </button>
      {message && <div className="mt-3 text-sm text-slate-300">{message}</div>}
    </div>
  );
}
