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
    <div className="flex-1 min-h-screen bg-[#060b14] p-4 sm:p-6 lg:p-8 font-mono overflow-x-hidden">
      <header className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter italic uppercase break-words">
            {activeTab === "all" ? "System_Overview" : `${activeTab}_Node`}
          </h1>
          <p className="text-[10px] sm:text-xs text-sky-500/60 tracking-[0.2em] sm:tracking-[0.3em] font-bold mt-1">
            STATUS: <span className="text-emerald-500 animate-pulse">SYSTEMS_NOMINAL</span>
          </p>
        </div>

        {/* 2. Cyberpunk Tab Navigation - Made horizontally scrollable on mobile */}
        <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
          <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as RoomKey)}
                className={`relative px-3 sm:px-4 py-2 transition-all duration-300 group ${
                  activeTab === tab.id 
                  ? "text-white" 
                  : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <div className="flex flex-col items-start leading-none pointer-events-none">
                  <span className="text-[8px] sm:text-[9px] mb-1 opacity-50">{tab.code}</span>
                  <span className="text-[10px] sm:text-xs font-black tracking-widest">{tab.label}</span>
                </div>
                
                {/* Active Underline Glow */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-500 shadow-[0_0_10px_#38bdf8]" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 3. Dynamic Content Grid - Optimized for Mobile, Tablet, and Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 relative z-10">
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

      {/* Background Subtle Detail - Scaled down for mobile */}
      <div className="fixed bottom-0 right-0 p-4 sm:p-8 opacity-5 pointer-events-none z-0 overflow-hidden">
        <div className="text-4xl sm:text-6xl lg:text-[80px] font-black italic select-none text-slate-700 whitespace-nowrap">
          NODE_{activeTab.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;