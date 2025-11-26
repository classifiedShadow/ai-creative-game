export default function HeroCard({
  title,
  subtitle,
  stageNumber,
  state, // "LOCKED" | "ACTIVE" | "COMPLETED"
  onClick
}) {
  const base =
    "relative flex flex-col items-center justify-end h-80 w-64 rounded-3xl border px-4 pb-4 transition-transform duration-200";

  const styles = {
    LOCKED:
      "border-slate-700 bg-slate-900/60 opacity-40 cursor-not-allowed",
    COMPLETED:
      "border-emerald-400/50 bg-gradient-to-b from-slate-900 to-emerald-900/40 opacity-70",
    ACTIVE:
      "border-cyan-400 bg-gradient-to-b from-slate-900 to-cyan-900/40 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 cursor-pointer animate-pulse"
  };

  return (
    <div className={`${base} ${styles[state]}`} onClick={state === "ACTIVE" ? onClick : undefined}>
      <div className="absolute top-4 text-xs tracking-widest text-slate-400">
        STAGE {stageNumber}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-xs text-slate-400 text-center">{subtitle}</div>
        <div className="mt-4 text-[11px] tracking-[0.25em] text-slate-400">
          {state === "LOCKED" && "LOCKED"}
          {state === "ACTIVE" && "READY"}
          {state === "COMPLETED" && "COMPLETED"}
        </div>
      </div>
    </div>
  );
}
