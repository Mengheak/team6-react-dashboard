import React from 'react';
import type { SensorData } from '../../hooks/useSensors';
import ActuatorCard from '../ActuatorCard';
import { topic as roomTopics } from '../../constant';

const BathRoom: React.FC<{ data: SensorData; publishMessage: (topic: string, message: string) => void }> = ({ data, publishMessage }) => (
    <div className="w-full max-w-2xl border border-slate-800 bg-slate-900/40 p-6 rounded-sm relative overflow-hidden group">
        <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
                <span className="text-[10px] text-cyan-400 font-bold tracking-[0.3em]">UNIT_04</span>
                <h2 className="text-xl font-black text-white tracking-tighter italic uppercase">BATH_ROOM</h2>
            </div>
            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest border border-slate-800 px-2 py-1">
                IP67_RATED
            </div>
        </div>

        <ActuatorCard
            onclick={() => publishMessage(roomTopics.bathroom.led, data.bathroom.led === "ON" ? "OFF" : "ON")}
            label="VANITY_MIRROR"
            value={data.bathroom.led as "ON" | "OFF"}
            icon="🚿"
            subLabel="HUMIDITY_RESISTANT"
            hexColorOn="#22d3ee"
            hexColorOff="#1e293b"
        />
    </div>
);
export default BathRoom;