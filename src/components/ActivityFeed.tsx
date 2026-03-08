import { useActivity } from "../hooks/useActivity";


// --- Utilities ---
const timeAgo = (ts: number) => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  const hours = Math.floor(diff / 3600);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

// --- Component ---
export const ActivityFeed = () => {
  const { activities } = useActivity();

  return (
    <div
      className="w-full max-w-2xl rounded-xl flex flex-col overflow-hidden"
      style={{
        background: "#020617",
        border: "1px solid #1e293b",
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)"
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <h2 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
            System.Telemetry_Log
          </h2>
        </div>
        <div className="flex items-center gap-2">
            <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-500/80 tabular-nums">LIVE_{activities.length}</span>
        </div>
      </div>

      {/* List */}
      <ul className="divide-y divide-slate-800/40 overflow-y-auto max-h-[500px] custom-scrollbar">
        {activities.slice(0,20).map((a, i) => {
          return (
            <li
              key={i}
              className="group relative px-5 py-4 transition-all hover:bg-slate-800/20"
            >
              {/* Top Row: Meta & Time */}
              <div className="flex items-center justify-between mb-1.5">
    
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 tabular-nums">
                        {timeAgo(a.timestamp)}
                    </span>
                </div>
              </div>

              {/* Bottom Row: Content */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-slate-200 font-medium truncate">
                  {a.email}
                </span>
                {a.desc && (
                  <span className="text-xs text-slate-500 italic truncate border-l-2 border-slate-800 pl-2 mt-1">
                    {a.desc}
                  </span>
                )}
              </div>

              {/* Hover highlight bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-900/30 border-t border-slate-800 flex justify-between items-center">
        <div className="text-[9px] text-slate-600 flex gap-4">
            <span>REGION: US-EAST-1</span>
            <span>PROTOCOL: WSS_SECURE</span>
        </div>
        <div className="text-[9px] text-slate-500 italic">
            v2.4.0-stable
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;