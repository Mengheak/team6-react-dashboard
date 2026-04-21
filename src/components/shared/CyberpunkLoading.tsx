
const CyberpunkLoading = ({ status }: { status: string }) => {
  return (
    <div className="min-h-screen bg-[#060b14] flex flex-col items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/10 via-[#060b14] to-[#060b14]" />
      
      <div className="z-10 flex flex-col items-center max-w-md w-full p-8 border border-slate-800 bg-slate-900/50 backdrop-blur-md relative shadow-2xl">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sky-500" />

        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-t-2 border-l-2 border-sky-500 rounded-full animate-spin" style={{ animationDuration: '1s' }} />
          <div className="absolute inset-2 border-r-2 border-b-2 border-indigo-500 rounded-full animate-spin shadow-[0_0_15px_#a78bfa]" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          <div className="absolute inset-4 border-t-2 border-emerald-500 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          <div className="text-[10px] font-black text-sky-400 animate-pulse tracking-widest mt-1">SYS</div>
        </div>

        <h2 className="text-xl font-black text-white tracking-[0.2em] mb-2 uppercase text-center">
          {status === "FETCHING_CLOUD" && "Syncing_Cloud"}
          {status === "CONNECTING" && "Establishing_Link"}
          {status === "RECONNECTING" && "Re-Establishing_Link"}
          {status === "ERROR" && "Connection_Failed"}
        </h2>
        
        <div className="w-full bg-slate-950 h-1 mt-4 mb-2 overflow-hidden">
          <div className={`h-full ${status === "ERROR" ? "bg-red-500 w-full" : "bg-sky-500 animate-[pulse_1s_ease-in-out_infinite] w-2/3"}`} />
        </div>

        <div className="text-[10px] text-slate-500 tracking-widest font-bold flex justify-between w-full mt-2">
          <span>PROTOCOL: MQTT_WSS</span>
          <span className={status === "ERROR" ? "text-red-500" : "text-sky-500 animate-pulse"}>
            [{status}]
          </span>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkLoading;