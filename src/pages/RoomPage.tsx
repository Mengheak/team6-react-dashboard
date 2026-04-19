import React, { useState } from "react";
import useSensors from "../hooks/useSensors";
import BathRoom from "../components/rooms/BathRoom";
import LivingRoom from "../components/rooms/LivingRoom";
import { Kitchen } from "../components/rooms/Kitchen";
import { BedRoom } from "../components/rooms/BedRoom";

type RoomKey = "all" | "living_room" | "kitchen" | "bathroom" | "bedroom";

const RoomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoomKey>("all");
  const { data, publishMessage } = useSensors({ 
    room: activeTab === "all" ? "all" : activeTab 
  });
  const tabs = [
    { id: "all", label: "OVERVIEW", code: "00" },
    { id: "living_room", label: "LIVING", code: "01" },
    { id: "bedroom", label: "BEDROOM", code: "02" },
    { id: "kitchen", label: "KITCHEN", code: "03" },
    { id: "bathroom", label: "BATHROOM", code: "04" },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#060b14] p-4 lg:p-8 font-mono">
      {/* 1. Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
            {activeTab === "all" ? "System_Overview" : `${activeTab}_Node`}
          </h1>
          <p className="text-xs text-sky-500/60 tracking-[0.3em] font-bold mt-1">
            STATUS: <span className="text-emerald-500 animate-pulse">SYSTEMS_NOMINAL</span>
          </p>
        </div>

        {/* 2. Cyberpunk Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RoomKey)}
              className={`relative px-4 py-2 transition-all duration-300 group ${
                activeTab === tab.id 
                ? "text-white" 
                : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] mb-1 opacity-50">{tab.code}</span>
                <span className="text-xs font-black tracking-widest">{tab.label}</span>
              </div>
              
              {/* Active Underline Glow */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-500 shadow-[0_0_10px_#38bdf8]" />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* 3. Dynamic Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(activeTab === "all" || activeTab === "living_room") && (
          <LivingRoom data={data} publishMessage={publishMessage} />
        )}
        {(activeTab === "all" || activeTab === "kitchen") && (
          <Kitchen data={data} publishMessage={publishMessage} />
        )}
        {(activeTab === "all" || activeTab === "bedroom") && (
          <BedRoom data={data} publishMessage={publishMessage} />
        )}
        {(activeTab === "all" || activeTab === "bathroom") && (
          <BathRoom data={data} publishMessage={publishMessage} />
        )}
      </div>

      {/* Background Subtle Detail */}
      <div className="fixed bottom-0 right-0 p-8 opacity-10 pointer-events-none">
        <div className="text-[80px] font-black italic select-none text-slate-700">NODE_{activeTab.toUpperCase()}</div>
      </div>
    </div>
  );
};

export default RoomPage;