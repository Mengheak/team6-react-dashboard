const StatusDot = ({ color = "emerald" }: { color?: "emerald" | "red" | "amber" }) => {
  const colorMap = {
    emerald: { ping: "bg-emerald-400", dot: "bg-emerald-500" },
    red: { ping: "bg-red-400", dot: "bg-red-500" },
    amber: { ping: "bg-amber-400", dot: "bg-amber-500" },
  };
  const c = colorMap[color];
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.ping} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c.dot}`}></span>
    </span>
  );
};
export default StatusDot;