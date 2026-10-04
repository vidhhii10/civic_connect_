import React from "react";

export default function ProgressBar({ percentage = 0, showLabel = true }) {
  const clamped = Math.min(100, Math.max(0, Number(percentage) || 0));

  // Determine progress color
  let barColor = "var(--status-pending)";
  if (clamped >= 100) {
    barColor = "var(--status-completed)";
  } else if (clamped >= 50) {
    barColor = "var(--status-progress)";
  }

  return (
    <div className="progress-container">
      {showLabel && (
        <div className="progress-header">
          <span className="progress-label">Resolution Progress</span>
          <span className="progress-percent" style={{ color: barColor }}>
            {clamped}%
          </span>
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor
          }}
        />
      </div>
    </div>
  );
}
