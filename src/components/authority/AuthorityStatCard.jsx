import React from "react";

export default function AuthorityStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "total"
}) {
  return (
    <div className="authority-kpi-card">
      <div className="kpi-info">
        <span className="kpi-label">{label}</span>
        <span className="kpi-value">{value}</span>
        {subtext && <span className="kpi-subtext">{subtext}</span>}
      </div>
      {Icon && (
        <div className={`kpi-icon-box kpi-icon-${variant}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
