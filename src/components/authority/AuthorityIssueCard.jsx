import React from "react";
import { MapPin, User, Calendar, AlertTriangle, Building, SlidersHorizontal } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

export default function AuthorityIssueCard({ issue, onStatusChange, onSelectIssue }) {
  const formattedDate = new Date(issue.timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("resolved") || s.includes("completed")) return "status-select-completed";
    if (s.includes("progress")) return "status-select-progress";
    if (s.includes("rejected")) return "status-select-rejected";
    return "status-select-pending";
  };

  const handleSelectChange = (newStatus) => {
    let percentage = 0;
    if (newStatus === "Resolved" || newStatus === "Completed") percentage = 100;
    else if (newStatus === "In Progress") percentage = 50;
    else percentage = 0;

    onStatusChange(issue.id, newStatus, percentage);
  };

  const prio = issue.priority || "Medium";

  return (
    <article
      className="authority-mobile-card"
      onClick={() => onSelectIssue && onSelectIssue(issue)}
    >
      <div className="authority-mobile-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="mobile-card-id">#{issue.id}</span>
          <span className={`table-prio-tag prio-${prio.toLowerCase()}`}>
            <AlertTriangle size={10} />
            {prio}
          </span>
        </div>
        <span className="mobile-card-cat">{issue.category}</span>
      </div>

      <p className="mobile-card-desc">{issue.description}</p>

      <div className="mobile-card-meta">
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Building size={13} color="var(--accent-cyan)" />
          {issue.department || "General Municipal"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={13} color="var(--accent-cyan)" />
          {issue.address}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <User size={13} />
          {issue.reporterName} ({issue.contact || "No phone"})
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Calendar size={13} />
          {formattedDate}
        </span>
      </div>

      <div style={{ marginTop: 4 }}>
        <ProgressBar percentage={issue.percentage} showLabel={true} />
      </div>

      <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
        <select
          className={`table-status-select ${getStatusClass(issue.status)}`}
          value={issue.status}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          type="button"
          className="table-manage-btn"
          onClick={() => onSelectIssue && onSelectIssue(issue)}
        >
          <SlidersHorizontal size={13} />
          <span>Manage Details</span>
        </button>
      </div>
    </article>
  );
}

