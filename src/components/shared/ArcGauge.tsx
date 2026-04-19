const ArcGauge = ({
  value,
  min,
  max,
  color,
  label,
}: {
  value: number;
  min: number;
  max: number;
  color: string;
  label: string;
}) => {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const r = 52;
  const cx = 64, cy = 64;
  const startAngle = -210;
  const sweep = 240;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (pct: number) => {
    const start = toRad(startAngle);
    const end = toRad(startAngle + sweep * pct);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = sweep * pct > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const trackPath = arcPath(1);
  const fillPath = arcPath(pct);

  return (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path d={trackPath} fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
      <path
        d={fillPath}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
        {value?.toFixed(1)}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">
        {label}
      </text>
    </svg>
  );
};
export default ArcGauge;