import React from 'react';
import type { SensorData } from '../../hooks/useSensors';
import ActuatorCard from '../ActuatorCard';
import { topic as roomTopics } from '../../constant';

export const BedRoom: React.FC<{ data: SensorData; publishMessage: (topic: string, message: string) => void }> = ({ data, publishMessage }) => (
  <div className="w-full max-w-2xl border border-slate-800 bg-slate-900/40 p-6 rounded-sm relative overflow-hidden group border-b-indigo-500/50">
    <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all" />

    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-col">
        <span className="text-[10px] text-indigo-400 font-bold tracking-[0.3em]">UNIT_02</span>
        <h2 className="text-xl font-black text-white tracking-tighter italic uppercase">BED_ROOM</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ActuatorCard
        onclick={() => publishMessage(roomTopics.bedroom.led, data.bedroom.led === "ON" ? "OFF" : "ON")}
        label="NIGHT_LED"
        value={data.bedroom.led as "ON" | "OFF"}
        icon="🌙"
        subLabel="SOFT_LIGHTING"
        hexColorOn="#a78bfa"
        hexColorOff="#1e293b"
      />
      <ActuatorCard
        onclick={() => publishMessage(roomTopics.bedroom.fan, data.bedroom.fan === "ON" ? "OFF" : "ON")}
        label="SILENT_FAN"
        value={data.bedroom.fan as "ON" | "OFF"}
        icon="🌬️"
        subLabel="SLEEP_MODE"
        hexColorOn="#818cf8"
        hexColorOff="#1e293b"
      />
    </div>
  </div>
);