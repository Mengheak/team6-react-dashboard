import StatusDot from "./shared/StatusDot";

const ActuatorCard = ({
  onclick,
  label,
  value,
  icon,
  hexColorOn,
  hexColorOff,
  subLabel,
}: {
  onclick?: () => void
  label: string;
  value: "ON" | "OFF";
  icon: React.ReactNode;
  hexColorOn: string;
  hexColorOff: string;
  subLabel: string;
}) => {
  const isOn = value === "ON";
  const hexColor = isOn ? hexColorOn : hexColorOff;

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0c1322 100%)",
        border: `1px solid ${isOn ? `${hexColor}44` : "#1e293b"}`,
        boxShadow: isOn
          ? `0 0 30px ${hexColor}22, inset 0 1px 0 ${hexColor}22`
          : "0 0 30px #00000044, inset 0 1px 0 #ffffff06",
      }}
      onClick={onclick}
    >
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full" style={{ background: hexColor }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot color={isOn ? "emerald" : "amber"} />
          <span className="text-xs font-black tracking-widest" style={{ color: isOn ? "#4ade80" : "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
            {value}
          </span>
        </div>
      </div>

      {/* Big toggle indicator */}
      <div className="flex items-center gap-5">
        {/* Power ring */}
        <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
          <svg viewBox="0 0 72 72" className="absolute inset-0 w-full h-full">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#1e293b" strokeWidth="4" />
            {isOn && (
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke={hexColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="188.5"
                strokeDashoffset="0"
                style={{ filter: `drop-shadow(0 0 8px ${hexColor})` }}
              />
            )}
          </svg>
          <span className="text-3xl z-10" style={{ filter: isOn ? `drop-shadow(0 0 8px ${hexColor})` : "grayscale(1) opacity(0.3)" }}>
            {icon}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className="text-4xl font-black leading-none tracking-tight"
            style={{
              color: hexColor,
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: isOn ? `0 0 20px ${hexColor}88` : "none",
              opacity: isOn ? 1 : 0.4,
            }}
          >
            {(label === "Door") ? (value === "ON" ? "OPENED" : "CLOSED") : value}
          </div>
          <div className="text-xs text-slate-500 tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {subLabel}
          </div>
          {/* State pill */}
          <div
            className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold tracking-widest w-fit"
            style={{
              background: isOn ? `${hexColor}18` : "#1e293b",
              border: `1px solid ${isOn ? `${hexColor}44` : "#334155"}`,
              color: isOn ? hexColor : "#475569",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isOn ? hexColor : "#475569", boxShadow: isOn ? `0 0 6px ${hexColor}` : "none" }}
            />
            {isOn ? "ACTIVE" : "STANDBY"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ActuatorCard;