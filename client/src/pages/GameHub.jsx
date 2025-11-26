import { useEffect, useState } from "react";
import api from "../utils/api.js";
import HeroCard from "../components/HeroCard.jsx";
import { useNavigate } from "react-router-dom";

export default function GameHub() {
  const [state, setState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/game/state");
      setState(res.data);
    };
    load();
  }, []);

  if (!state) return <div className="text-center mt-20 text-slate-300">Loading...</div>;

  const { global, userStatus } = state;

  const getCardState = (active, completed) => {
    if (!active) return "LOCKED";
    if (completed) return "COMPLETED";
    return "ACTIVE";
  };

  return (
    <div className="flex flex-col items-center mt-10 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8 tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
        COMPETITIVE QUEUE
      </h1>

      <div className="flex gap-8 flex-wrap justify-center">
        <HeroCard
          title="Text-to-Image"
          subtitle="Generate, submit, and vote on AI art."
          stageNumber={1}
          state={getCardState(global.stage1Active, userStatus.stage1)}
          onClick={() => navigate("/stage1")}
        />

        <HeroCard
          title="Guess the Prompt"
          subtitle="Read the image. Pick the closest prompt."
          stageNumber={2}
          state={getCardState(global.stage2Active, userStatus.stage2)}
          onClick={() => navigate("/stage2")}
        />

        <HeroCard
          title="Image Recreation"
          subtitle="Recreate the target image with AI."
          stageNumber={3}
          state={getCardState(global.stage3Active, userStatus.stage3)}
          onClick={() => navigate("/stage3")}
        />
      </div>
    </div>
  );
}
