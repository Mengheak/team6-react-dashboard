import type { LucideIcon } from "lucide-react";

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  Icon: LucideIcon; 
}

const ToggleButton = ({ label, active, onToggle, Icon }: ToggleButtonProps) => (
  <button 
    onClick={onToggle}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
      active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
    }`}
  >
    <div className="flex items-center gap-3">
      {/* Now you just render it like a normal component! */}
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </div>
    <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${active ? "bg-indigo-400" : "bg-slate-200"}`}>
      {active ? "Active" : "Off"}
    </div>
  </button>
);
export default ToggleButton;