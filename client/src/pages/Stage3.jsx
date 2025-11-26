import { useState } from "react";
import api from "../utils/api.js";

const targetImage =
  "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=600";

export default function Stage3() {
  const [prompt, setPrompt] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [message, setMessage] = useState("");

  const generate = async () => {
    const res = await api.post("/game/stage1/generate", { prompt }); // reuse
    setGeneratedUrl(res.data.imageUrl);
  };

  const submit = async () => {
    if (!generatedUrl) return;
    // similarityScore should come from AI; placeholder 75
    await api.post("/game/stage3/submit", {
      prompt,
      imageUrl: generatedUrl,
      similarityScore: 75
    });
    setMessage("Stage 3 submitted!");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Stage 3 – Image Recreation Challenge
      </h2>
      <div className="flex gap-6 mb-4 flex-wrap">
        <div>
          <p className="text-xs text-slate-400 mb-1">Target Image</p>
          <img
            src={targetImage}
            alt="target"
            className="w-64 rounded-xl border border-slate-700"
          />
        </div>
        <div className="flex-1">
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm mb-2"
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the target image as accurately as possible..."
          />
          <button
            onClick={generate}
            className="px-3 py-1 bg-cyan-500/80 hover:bg-cyan-400 text-slate-900 rounded text-sm mr-2"
          >
            Generate Attempt
          </button>
          {generatedUrl && (
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-1">Your Attempt</p>
              <img
                src={generatedUrl}
                alt="attempt"
                className="w-64 rounded-xl border border-slate-700"
              />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={submit}
        disabled={!generatedUrl}
        className="px-4 py-2 bg-emerald-500/80 hover:bg-emerald-400 text-slate-900 rounded text-sm disabled:opacity-40"
      >
        Submit Final Attempt
      </button>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
