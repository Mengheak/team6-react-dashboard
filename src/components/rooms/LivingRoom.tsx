import React from 'react';
import type { SensorData } from '../../hooks/useSensors';
import ActuatorCard from '../ActuatorCard';
import { topic as roomTopics } from '../../constant';

export const LivingRoom: React.FC<{ data: SensorData; publishMessage: (topic: string, message: string) => void }> = ({ data, publishMessage }) => (
  <div className="w-full max-w-2xl border border-slate-800 bg-slate-900/40 p-6 rounded-sm relative overflow-hidden group">
    {/* Tech Background Accent */}
    <div className="absolute -top-10 -left-10 w-20 h-20 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-all" />
    
    <div className="flex justify-between items-center mb-6 border-b border-slate-800/50 pb-4">
      <div className="flex flex-col">
        <span className="text-[10px] text-sky-500 font-bold tracking-[0.3em]">NODE_01</span>
        <h2 className="text-xl font-black text-white tracking-tighter italic">LIVING_ROOM</h2>
      </div>
      <div className="text-right">
        <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-widest">ENV_TELEMETRY</div>
        <span className="text-sm font-bold text-sky-400 tabular-nums">
          {data.living_room.temperature ?? '--'}°C / {data.living_room.humidity ?? '--'}%
        </span>
      </div>
    </div>

    {/* 2x2 Controller Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ActuatorCard
        onclick={() => publishMessage(roomTopics.living_room.led1, data.living_room.led1 === "ON" ? "OFF" : "ON")}
        label="PRIMARY_LED"
        value={data.living_room.led1 as "ON" | "OFF"}
        icon="💡"
        subLabel="ZONE_A_LIGHT"
        hexColorOn="#38bdf8"
        hexColorOff="#1e293b"
      />
      
      <ActuatorCard
        onclick={() => publishMessage(roomTopics.living_room.led2, data.living_room.led2 === "ON" ? "OFF" : "ON")}
        label="AMBIENT_LED"
        value={data.living_room.led2 as "ON" | "OFF"}
        icon="✨"
        subLabel="ZONE_B_LIGHT"
        hexColorOn="#38bdf8"
        hexColorOff="#1e293b"
      />

      <ActuatorCard
        onclick={() => publishMessage(roomTopics.living_room.fan1, data.living_room.fan1 === "ON" ? "OFF" : "ON")}
        label="CLIMATE_FAN1"
        value={data.living_room.fan1 as "ON" | "OFF"}
        icon="🌀"
        subLabel="AIR_CIRCULATION"
        hexColorOn="#a78bfa"
        hexColorOff="#1e293b"
      />
       <ActuatorCard
        onclick={() => publishMessage(roomTopics.living_room.fan2, data.living_room.fan2 === "ON" ? "OFF" : "ON")}
        label="CLIMATE_FAN2"
        value={data.living_room.fan2 as "ON" | "OFF"}
        icon="🌀"
        subLabel="AIR_CIRCULATION"
        hexColorOn="#a78bfa"
        hexColorOff="#1e293b"
      />
      <ActuatorCard
        onclick={() => publishMessage(roomTopics.living_room.door, data.living_room.door === "ON" ? "OFF" : "ON")}
        label="MAIN_ENTRY"
        value={data.living_room.door as "ON" | "OFF"}
        icon="🚪"
        subLabel="SECURITY_LOCK"
        hexColorOn="#fb7185" // Rose color for security/doors
        hexColorOff="#1e293b"
      />
    </div>

    {/* Status Footer */}
    <div className="mt-6 flex items-center gap-2 text-[9px] text-slate-600 font-bold tracking-widest">
      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_5px_#38bdf8]" />
      MODULE_LVR_ACTIVE // ALL_SYSTEMS_GO
    </div>
  </div>
);

export default LivingRoom;