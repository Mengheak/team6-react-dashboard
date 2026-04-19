import React, { useState, useEffect } from "react";
import useSensors from "../hooks/useSensors";
import ActivityFeed from "./ActivityFeed";
import { topics } from "../constant";
import useHistory from "../hooks/useHistory";
import SensorCard from "./shared/SensorCard";
import StatusDot from "./shared/StatusDot";
import GasLevelCard from "./GasLevelCard";
import ActuatorCard from "./ActuatorCard";





export const Sensors: React.FC = () => {
  const { data, publishMessage } = useSensors({ room: "all" });
  const { living_room, kitchen } = data
  const { temperature, humidity, door } = living_room
  const { gasLevel, gasAlert, led } = kitchen;
  const tempHistory = useHistory(living_room.temperature as number, 30);
  const humHistory = useHistory(living_room.humidity as number, 30);
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
          value={temperature as number}
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
          value={humidity as number}
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
        <GasLevelCard gasLevel={gasLevel as number} gasAlert={gasAlert as "GAS" | "SAFE"} />
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
          onclick={() => publishMessage(topics.get("door") as string, door === "ON" ? "OFF" : "ON")}
          label="Door"
          value={door as "ON" | "OFF"}
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