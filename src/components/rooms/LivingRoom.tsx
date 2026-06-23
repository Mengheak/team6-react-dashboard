import React from 'react';
import type { SensorData } from '../../hooks/useSensors';
import ActuatorCard from '../ActuatorCard';
import { topic as roomTopics } from '../../constant';

export const LivingRoom: React.FC<{ data: SensorData; publishMessage: (topic: string, message: string) => void }> = ({ data, publishMessage }) => {
  const motionPayload = data.living_room.motion?.toUpperCase();
  const isMotion = motionPayload === "MOTION" || motionPayload === "DETECTED" || motionPayload === "ON";

  return (


    <div className="w-full max-w-2xl border border-slate-800 bg-slate-900/40 p-6 rounded-sm relative overflow-hidden group">
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
          label="DOOR"
          value={data.living_room.door as "ON" | "OFF"}
          icon="🚪"
          subLabel="SECURITY_LOCK"
          hexColorOn="#fb7185"
          hexColorOff="#1e293b"
        />
        <div className="relative flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl p-5 sm:p-6 backdrop-blur-sm group overflow-hidden transition-all duration-500 hover:border-slate-700">

          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none text-6xl font-black italic">
            MOTION
          </div>
          <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${isMotion ? 'via-red-500/50' : 'via-emerald-500/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isMotion ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></span>
                MOTION_DETECTOR
              </h2>
          
            </div>
          </div>

          <div className="flex items-center gap-6 mt-2 z-10">

            <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-slate-800 bg-black/30">
              {isMotion ? (
                <>
                  <div className="absolute inset-0 rounded-full border border-red-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute inset-0 rounded-full border border-red-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
                  <span className="text-2xl relative z-10 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">🚶</span>
                </>
              ) : (
                <span className="text-2xl opacity-40 grayscale">🚶</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-400 tracking-widest font-bold mb-1">SECTOR_STATUS</span>

              <span className={`text-2xl sm:text-3xl font-black tracking-wider ${isMotion ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-emerald-500"}`}>
                {isMotion ? "DETECTED" : "CLEAR"}
              </span>

              <span className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mt-2">
                {isMotion ? ">> ENTITY_PRESENT <<" : "NO_ACTIVITY_LOGGED"}
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default LivingRoom;