import ArcGauge from "./ArcGauge";
import SparkLine from "./SparkLine";
import StatusDot from "./StatusDot";

const SensorCard = ({
  label,
  value,
  unit,
  icon,
  hexColor,
  min,
  max,
  warnHigh,
  warnLow,
  history,
}: {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  hexColor: string;
  min: number;
  max: number;
  warnHigh: number;
  warnLow: number;
  history: number[];
}) => {
  const isWarn = value >= warnHigh || value <= warnLow;
  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0c1322 100%)",
        border: `1px solid ${isWarn ? "#f59e0b44" : "#1e293b"}`,
        boxShadow: isWarn
          ? "0 0 30px #f59e0b22, inset 0 1px 0 #f59e0b22"
          : `0 0 30px ${hexColor}18, inset 0 1px 0 #ffffff08`,
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full" style={{ background: hexColor }} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </span>
        </div>
        {isWarn ? (
          <span className="text-xs font-bold text-amber-400 tracking-widest animate-pulse">⚠ WARN</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <StatusDot />
            <span className="text-xs text-emerald-400 tracking-widest font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 flex-shrink-0">
          <ArcGauge value={value} min={min} max={max} color={hexColor} label={unit} />
        </div>
        <div className="flex flex-col gap-1">
          <div
            className="text-5xl font-black tabular-nums leading-none"
            style={{ color: hexColor, fontFamily: "'JetBrains Mono', monospace", textShadow: `0 0 20px ${hexColor}66` }}
          >
            {value?.toFixed(1)}
          </div>
          <div className="text-sm font-medium text-slate-400">{unit}</div>
          <div className="mt-2 flex gap-3 text-xs text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span>MIN <span className="text-slate-300">{min}</span></span>
            <span>MAX <span className="text-slate-300">{max}</span></span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-slate-600 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <span>TREND</span>
          <span>{history.length} pts</span>
        </div>
        <SparkLine data={history} color={hexColor} min={min} max={max} />
      </div>
    </div>
  );
};
export default SensorCard;