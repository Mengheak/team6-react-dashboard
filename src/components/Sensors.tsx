import React, { useState, useEffect, useRef } from "react";
import { useSensors } from "../hooks/useSensors";
import ActivityFeed from "./ActivityFeed";
import { topics } from "../constant";

// Spark line history hook
const useHistory = (value: number, max = 30) => {
  const history = useRef<number[]>([]);
  useEffect(() => {
    history.current = [...history.current.slice(-(max - 1)), value];
  }, [value, max]);
  return history.current;
};

// Mini SVG spark line
const SparkLine = ({ data, color, min, max }: { data: number[]; color: string; min: number; max: number }) => {
  if (data.length < 2) return null;
  const w = 200, h = 48;
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full h-12 overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${h} ${pts.join(" ")} ${w},${h}`}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
    </svg>
  );
};

// Radial arc gauge
const ArcGauge = ({
  value,
  min,
  max,
  color,
  label,
}: {
  value: number;
  min: number;
  max: number;
  color: string;
  label: string;
}) => {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const r = 52;
  const cx = 64, cy = 64;
  const startAngle = -210;
  const sweep = 240;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (pct: number) => {
    const start = toRad(startAngle);
    const end = toRad(startAngle + sweep * pct);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = sweep * pct > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const trackPath = arcPath(1);
  const fillPath = arcPath(pct);

  return (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path d={trackPath} fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
      <path
        d={fillPath}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
        {value.toFixed(1)}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">
        {label}
      </text>
    </svg>
  );
};

// Blinking status dot
const StatusDot = ({ color = "emerald" }: { color?: "emerald" | "red" | "amber" }) => {
  const colorMap = {
    emerald: { ping: "bg-emerald-400", dot: "bg-emerald-500" },
    red: { ping: "bg-red-400", dot: "bg-red-500" },
    amber: { ping: "bg-amber-400", dot: "bg-amber-500" },
  };
  const c = colorMap[color];
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.ping} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c.dot}`}></span>
    </span>
  );
};

// Single sensor card
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
            {value.toFixed(1)}
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

// Gas level card with horizontal bar gauge
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

// Toggle status card for LED / Servo
const ActuatorCard = ({
  onclick,
  label,
  value,
  icon,
  hexColorOn,
  hexColorOff,
  subLabel,
}: {
  onclick?: () => void
  label: string;
  value: "ON" | "OFF";
  icon: React.ReactNode;
  hexColorOn: string;
  hexColorOff: string;
  subLabel: string;
}) => {
  const isOn = value === "ON";
  const hexColor = isOn ? hexColorOn : hexColorOff;

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0c1322 100%)",
        border: `1px solid ${isOn ? `${hexColor}44` : "#1e293b"}`,
        boxShadow: isOn
          ? `0 0 30px ${hexColor}22, inset 0 1px 0 ${hexColor}22`
          : "0 0 30px #00000044, inset 0 1px 0 #ffffff06",
      }}
      onClick={onclick}
    >
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full" style={{ background: hexColor }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot color={isOn ? "emerald" : "amber"} />
          <span className="text-xs font-black tracking-widest" style={{ color: isOn ? "#4ade80" : "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
            {value}
          </span>
        </div>
      </div>

      {/* Big toggle indicator */}
      <div className="flex items-center gap-5">
        {/* Power ring */}
        <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
          <svg viewBox="0 0 72 72" className="absolute inset-0 w-full h-full">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#1e293b" strokeWidth="4" />
            {isOn && (
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke={hexColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="188.5"
                strokeDashoffset="0"
                style={{ filter: `drop-shadow(0 0 8px ${hexColor})` }}
              />
            )}
          </svg>
          <span className="text-3xl z-10" style={{ filter: isOn ? `drop-shadow(0 0 8px ${hexColor})` : "grayscale(1) opacity(0.3)" }}>
            {icon}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className="text-4xl font-black leading-none tracking-tight"
            style={{
              color: hexColor,
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: isOn ? `0 0 20px ${hexColor}88` : "none",
              opacity: isOn ? 1 : 0.4,
            }}
          >
            {(label === "Door") ? (value === "ON" ? "OPENED" : "CLOSED") : value}
          </div>
          <div className="text-xs text-slate-500 tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {subLabel}
          </div>
          {/* State pill */}
          <div
            className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold tracking-widest w-fit"
            style={{
              background: isOn ? `${hexColor}18` : "#1e293b",
              border: `1px solid ${isOn ? `${hexColor}44` : "#334155"}`,
              color: isOn ? hexColor : "#475569",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isOn ? hexColor : "#475569", boxShadow: isOn ? `0 0 6px ${hexColor}` : "none" }}
            />
            {isOn ? "ACTIVE" : "STANDBY"}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sensors: React.FC = () => {
  const { data, publishMessage } = useSensors();
  const { gasAlert, gasLevel, humidity, led, servo, temperature } = data
  const tempHistory = useHistory(temperature, 30);
  const humHistory = useHistory(humidity, 30);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col mx-auto w-full items-center justify-center p-6"
      style={{
        background: "#060b14",
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, #0d1f3c 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #0d1a2e 0%, transparent 60%)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs tracking-[0.3em] text-slate-500 uppercase mb-1">Environmental Monitor</div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              SENSOR<span style={{ color: "#38bdf8" }}>_</span>DASHBOARD
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 tracking-widest">SYS_TIME</div>
            <div className="text-sm font-bold text-slate-300 tabular-nums">
              {now.toLocaleTimeString("en-US", { hour12: false })}
            </div>
          </div>
        </div>
        <div className="mt-4 h-px w-full" style={{ background: "linear-gradient(90deg, #38bdf844, #a78bfa44, transparent)" }} />
      </div>

      {/* Temperature + Humidity */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SensorCard
          label="Temperature"
          value={temperature}
          unit="°C"
          icon="🌡"
          color="text-sky-400"
          hexColor="#f97316"
          min={0}
          max={50}
          warnHigh={40}
          warnLow={5}
          history={tempHistory}
        />
        <SensorCard
          label="Humidity"
          value={humidity}
          unit="%RH"
          icon="💧"
          color="text-cyan-400"
          hexColor="#38bdf8"
          min={0}
          max={100}
          warnHigh={90}
          warnLow={20}
          history={humHistory}
        />
      </div>

      {/* Section divider */}
      <div className="w-full max-w-2xl my-6 flex items-center gap-4">
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #1e293b)" }} />
        <span className="text-xs tracking-[0.3em] text-slate-600 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Gas &amp; Actuators
        </span>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #1e293b, transparent)" }} />
      </div>

      {/* Gas Level — full width */}
      <div className="w-full max-w-2xl mb-4">
        <GasLevelCard gasLevel={gasLevel} gasAlert={gasAlert as "GAS" | "SAFE"} />
      </div>

      {/* LED + Servo — side by side */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActuatorCard
          onclick={() => publishMessage(topics.get("led") as string, led === "ON" ? "OFF" : "ON")}
          label="LED"
          value={led as "ON" | "OFF"}
          icon="💡"
          hexColorOn="#facc15"
          hexColorOff="#334155"
          subLabel="STATUS INDICATOR"
        />
        <ActuatorCard
          onclick={() => publishMessage(topics.get("door") as string, servo === "ON" ? "OFF" : "ON")}
          label="Door"
          value={servo as "ON" | "OFF"}
          icon="⚙️"
          hexColorOn="#a78bfa"
          hexColorOff="#334155"
          subLabel="MOTOR ACTUATOR"
        />
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-600 tracking-widest">
        <StatusDot />
        <span>POLLING INTERVAL 1.2s · NODE_ID #ENV-01</span>
      </div>

      <ActivityFeed />
    </div>
  );
};

export default Sensors;