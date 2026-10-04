import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, MapPin, ShieldCheck } from "lucide-react";

export default function AuthorityHeader({ onToggleMobileMenu }) {
  const location = useLocation();

  const getHeaderMeta = () => {
    if (location.pathname === "/authority/issues") {
      return {
        title: "Issue Management",
        subtitle: "Review, filter, and dispatch municipal field tickets"
      };
    }
    if (location.pathname === "/authority/map") {
      return {
        title: "Interactive Ward Map",
        subtitle: "Geospatial monitoring & location-based triage for Ward R/South"
      };
    }
    if (location.pathname === "/authority/analytics") {
      return {
        title: "Analytics & SLA Dashboard",
        subtitle: "Performance KPIs, SLA compliance & municipal grievance reports"
      };
    }
    return {
      title: "Authority Dashboard",
      subtitle: "Municipal command center & real-time city grievance pulse"
    };
  };

  const meta = getHeaderMeta();

  return (
    <header className="authority-header">
      <div className="authority-header-left">
        <button
          className="authority-mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>
        <div className="authority-header-title-box">
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </div>

      <div className="authority-header-right">
        <div className="authority-jurisdiction-badge">
          <MapPin size={13} />
          <span>Zone 4 • Ward R/South (Mumbai)</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "12px",
            color: "var(--text-secondary)"
          }}
        >
          <ShieldCheck size={16} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 600, color: "#ffffff" }}>Admin Access</span>
        </div>
      </div>
    </header>
  );
}
