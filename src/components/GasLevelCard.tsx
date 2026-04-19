import StatusDot from "./shared/StatusDot";

const GasLevelCard = ({ gasLevel, gasAlert }: { gasLevel: number; gasAlert: "GAS" | "SAFE" }) => {
  const isAlert = gasAlert === "GAS";
  const hexColor = isAlert ? "#ef4444" : "#22d3ee";
  const pct = Math.min(100, Math.max(0, gasLevel));

  // Segmented bar ticks
  const ticks = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0c1322 100%)",
        border: `1px solid ${isAlert ? "#ef444444" : "#1e293b"}`,
        boxShadow: isAlert
          ? "0 0 40px #ef444422, inset 0 1px 0 #ef444422"
          : `0 0 30px ${hexColor}18, inset 0 1px 0 #ffffff08`,
      }}
    >
      {/* Alert pulse overlay */}
      {isAlert && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(ellipse at center, #ef444408 0%, transparent 70%)" }}
        />
      )}

      <div className="absolute top-0 right-0 w-28 h-28 opacity-10 rounded-bl-full" style={{ background: hexColor }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧪</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
            Gas Level
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot color={isAlert ? "red" : "emerald"} />
          <span
            className={`text-xs font-black tracking-widest ${isAlert ? "animate-pulse" : ""}`}
            style={{ color: hexColor, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {isAlert ? "⚠ GAS DETECTED" : "✓ SAFE"}
          </span>
        </div>
      </div>

      {/* Value + Bar */}
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div
            className="text-6xl font-black tabular-nums leading-none"
            style={{ color: hexColor, fontFamily: "'JetBrains Mono', monospace", textShadow: `0 0 24px ${hexColor}88` }}
          >
            {gasLevel}
          </div>
          <div className="text-xs text-slate-500 tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>PPM</div>
        </div>

        {/* Segmented horizontal bar */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex gap-[2px] items-end h-10">
            {ticks.map((i) => {
              const threshold = ((i + 1) / 20) * 100;
              const active = pct >= threshold - 4;
              const barHeight = 20 + (i / 19) * 20;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    background: active
                      ? i > 14
                        ? "#ef4444"
                        : i > 9
                          ? "#f59e0b"
                          : "#22d3ee"
                      : "#1e293b",
                    boxShadow: active ? `0 0 6px ${i > 14 ? "#ef4444" : i > 9 ? "#f59e0b" : "#22d3ee"}88` : "none",
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span>0</span>
            <span>SAFE</span>
            <span>WARN</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GasLevelCard;