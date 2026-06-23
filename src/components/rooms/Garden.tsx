import React from "react";
import type { SensorData } from "../../hooks/useSensors";

interface GardenProps {
  data: SensorData;
  publishMessage: (topic: string, message: string) => void;
}

const Garden: React.FC<GardenProps> = ({ data, publishMessage }) => {
  const { soil, pump, pumptime } = data.garden;

  const isPumpOn = pump === "ON";
  const soilValue = soil ?? 0;

  const getSoilStatus = () => {
    if (soilValue < 30) return { label: "CRITICAL", color: "text-red-500", bar: "bg-red-500" };
    if (soilValue <= 70) return { label: "OPTIMAL", color: "text-emerald-500", bar: "bg-emerald-500" };
    return { label: "SATURATED", color: "text-sky-500", bar: "bg-sky-500" };
  };

  const status = getSoilStatus();

  const togglePump = () => {
    publishMessage("home/garden/pump", isPumpOn ? "OFF" : "ON");
  };

  return (
    <div className="relative flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl p-5 sm:p-6 backdrop-blur-sm group overflow-hidden transition-all duration-500 hover:border-slate-700">
      
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none text-6xl font-black italic">
        05
      </div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
            GARDEN
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-600 tracking-widest">UPTIME</p>
          <p className="text-xs text-sky-400 font-bold tracking-widest">
            {pumptime ? pumptime : "00:00:00"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="bg-black/30 border border-slate-800/50 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400 tracking-widest font-bold">SOIL_LVL</span>
            <span className={`text-[10px] tracking-[0.2em] font-black ${status.color}`}>
              [{status.label}]
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-3xl font-black ${status.color}`}>
              {soil !== null ? soil : "--"}
            </span>
            <span className="text-sm text-slate-500 mb-1 font-bold">%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className={`h-full ${status.bar} transition-all duration-1000 ease-out`} 
              style={{ width: `${Math.min(Math.max(soilValue, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Pump Control */}
        <div className="bg-black/30 border border-slate-800/50 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400 tracking-widest font-bold">IRRIGATION</span>
            <span className="text-[10px] text-slate-600 tracking-widest">PUMP_CTRL</span>
          </div>

          <button
            onClick={togglePump}
            className={`relative w-full py-4 rounded border transition-all duration-300 overflow-hidden group/btn ${
              isPumpOn 
                ? "bg-sky-500/10 border-sky-500 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]" 
                : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
            }`}
          >
            {isPumpOn && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/10 to-transparent translate-y-[-100%] group-hover/btn:animate-[scan_2s_linear_infinite]" />
            )}
            
            <div className="flex items-center justify-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isPumpOn ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm font-black tracking-[0.3em] uppercase">
                {isPumpOn ? "PUMP_ACTIVE" : "PUMP_STANDBY"}
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Garden;