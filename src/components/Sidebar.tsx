import Logout from "./Logout";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "dashboard" | "users";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ─── Icons (inline SVG to avoid deps) ────────────────────────────────────────
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ─── Nav items config ─────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode; accent: string }[] = [
  { id: "dashboard", label: "Dashboard",    icon: <IconGrid />,  accent: "#38bdf8" },
  { id: "users",     label: "Manage Users", icon: <IconUsers />, accent: "#a78bfa" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export const Sidebar = ({
  activePage,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');`}</style>

      <aside
        style={{
          width: collapsed ? "64px" : "220px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #080e1a 0%, #060b14 100%)",
          borderRight: "1px solid #1e293b",
          fontFamily: "'JetBrains Mono', monospace",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            padding: collapsed ? "20px 0" : "20px 20px",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflow: "hidden",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {/* Hexagon logo mark */}
          <div style={{ flexShrink: 0, position: "relative", width: 32, height: 32 }}>
            <svg viewBox="0 0 32 32" width="32" height="32">
              <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                style={{ filter: "drop-shadow(0 0 6px #38bdf8aa)" }}
              />
              <polygon points="16,8 22,11.5 22,20.5 16,24 10,20.5 10,11.5" fill="#38bdf822" />
              <circle cx="16" cy="16" r="3" fill="#38bdf8" style={{ filter: "drop-shadow(0 0 4px #38bdf8)" }} />
            </svg>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
                ENV<span style={{ color: "#38bdf8" }}>_</span>SYS
              </div>
              <div style={{ fontSize: "9px", color: "#475569", letterSpacing: "0.2em", marginTop: "1px" }}>MONITOR v2</div>
            </div>
          )}
        </div>

        {/* Nav section label */}
        {!collapsed && (
          <div style={{ padding: "16px 20px 6px", fontSize: "9px", color: "#334155", letterSpacing: "0.3em", fontWeight: 700 }}>
            NAVIGATION
          </div>
        )}

        {/* Nav items */}
        <nav style={{ padding: collapsed ? "12px 0" : "8px 10px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: collapsed ? "10px 0" : "9px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  background: isActive ? `${item.accent}15` : "transparent",
                  color: isActive ? item.accent : "#64748b",
                  outline: isActive ? `1px solid ${item.accent}33` : "1px solid transparent",
                  transition: "all 0.15s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#ffffff08";
                    (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                  }
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <span style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: "3px", borderRadius: "0 3px 3px 0",
                    background: item.accent,
                    boxShadow: `0 0 8px ${item.accent}`,
                  }} />
                )}

                {/* Icon */}
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isActive ? item.accent : "inherit",
                  filter: isActive ? `drop-shadow(0 0 4px ${item.accent}88)` : "none",
                  flexShrink: 0,
                }}>
                  {item.icon}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span style={{ fontSize: "11px", fontWeight: isActive ? 700 : 600, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                    {item.label.toUpperCase()}
                  </span>
                )}

                {/* Active dot (collapsed mode) */}
                {collapsed && isActive && (
                  <span style={{
                    position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)",
                    width: "4px", height: "4px", borderRadius: "50%",
                    background: item.accent, boxShadow: `0 0 6px ${item.accent}`,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* System status */}
        {!collapsed && (
          <div style={{
            margin: "0 10px 10px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "#0f172a",
            border: "1px solid #1e293b",
          }}>
            <div style={{ fontSize: "9px", color: "#334155", letterSpacing: "0.3em", marginBottom: "8px" }}>SYS_STATUS</div>
            {[
              { label: "SENSORS", color: "#34d399", value: "ONLINE" },
              { label: "STREAM",  color: "#38bdf8", value: "ACTIVE" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "9px", color: "#475569", letterSpacing: "0.15em" }}>{s.label}</span>
                <span style={{ fontSize: "9px", fontWeight: 700, color: s.color, letterSpacing: "0.1em" }}>● {s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Collapse toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            style={{
              position: "absolute",
              top: "22px",
              right: "-12px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#38bdf8";
              (e.currentTarget as HTMLButtonElement).style.color = "#38bdf8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b";
              (e.currentTarget as HTMLButtonElement).style.color = "#475569";
            }}
          >
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        )}
        <div className="fixed bottom-16 left-5">
        <Logout />
        </div>
      </aside>
    </>
  );
};