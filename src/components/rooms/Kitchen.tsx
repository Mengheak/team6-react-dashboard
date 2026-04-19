import React from 'react';
import type { SensorData } from '../../hooks/useSensors';
import ActuatorCard from '../ActuatorCard';
import { topic as roomTopics } from '../../constant';

export const Kitchen: React.FC<{ data: SensorData; publishMessage: (topic: string, message: string) => void }> = ({ data, publishMessage }) => {
  const isAlert = data.kitchen.gasAlert === "GAS";

  return (
    <div className={`w-full max-w-2xl border ${isAlert ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800'} bg-slate-900/40 p-6 rounded-sm relative overflow-hidden group transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-orange-500 font-bold tracking-[0.3em]">UNIT_03</span>
          <h2 className="text-xl font-black text-white tracking-tighter italic uppercase">Kitchen_Node</h2>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${isAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
          {isAlert ? 'GAS_ALERT' : 'SECURE'}
        </div>
      </div>

      <div className="mb-6 p-4 bg-black/40 border-l-2 border-orange-500">
        <span className="text-[10px] text-slate-500 block mb-1 font-bold tracking-widest">GAS Level</span>
        <span className="text-2xl font-black text-orange-400 tabular-nums">
          {data.kitchen.gasLevel ?? 0} <span className="text-sm font-normal opacity-50">PPM</span>
        </span>
      </div>

      <ActuatorCard
        onclick={() => publishMessage(roomTopics.kitchen.led, data.kitchen.led === "ON" ? "OFF" : "ON")}
        label="KITCHEN_OVERHEAD"
        value={data.kitchen.led as "ON" | "OFF"}
        icon="🍳"
        subLabel="UTILITY_LIGHT"
        hexColorOn="#facc15"
        hexColorOff="#1e293b"
      />
    </div>
  );
};