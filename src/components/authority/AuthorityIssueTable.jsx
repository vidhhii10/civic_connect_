import React from "react";
import { MapPin, Calendar, SlidersHorizontal, AlertTriangle, Building } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

export default function AuthorityIssueTable({ issues, onStatusChange, onSelectIssue }) {
  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("resolved") || s.includes("completed")) return "status-select-completed";
    if (s.includes("progress")) return "status-select-progress";
    if (s.includes("rejected")) return "status-select-rejected";
    return "status-select-pending";
  };

  const handleSelectChange = (issueId, newStatus) => {
    let percentage = 0;
    if (newStatus === "Resolved" || newStatus === "Completed") percentage = 100;
    else if (newStatus === "In Progress") percentage = 50;
    else percentage = 0;

    onStatusChange(issueId, newStatus, percentage);
  };

  return (
    <div className="authority-table-scroll-container">
      <table className="authority-data-table">
        <thead>
          <tr>
            <th style={{ minWidth: 100 }}>Ticket ID</th>
            <th style={{ minWidth: 160 }}>Category &amp; Priority</th>
            <th style={{ minWidth: 190 }}>Department</th>
            <th style={{ minWidth: 240 }}>Description &amp; Location</th>
            <th style={{ minWidth: 140 }}>Citizen Reporter</th>
            <th style={{ minWidth: 120 }}>Reported Date</th>
            <th style={{ minWidth: 130 }}>Progress</th>
            <th style={{ minWidth: 140 }}>Status</th>
            <th style={{ minWidth: 110 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const formattedDate = new Date(issue.timestamp).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric"
              }
            );

            const prio = issue.priority || "Medium";

            return (
              <tr
                key={issue.id}
                className="authority-table-row-clickable"
                onClick={() => onSelectIssue && onSelectIssue(issue)}
              >
                <td className="cell-ticket-id">#{issue.id}</td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span className="cell-cat-tag">{issue.category}</span>
                    <span className={`table-prio-tag prio-${prio.toLowerCase()}`}>
                      <AlertTriangle size={10} />
                      {prio}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="cell-department" title={issue.department || "General Municipal"}>
                    <Building size={12} color="var(--accent-cyan)" />
                    <span>{issue.department || "General Municipal"}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-desc-group">
                    <div className="cell-desc" title={issue.description}>
                      {issue.description}
                    </div>
                    <div className="cell-address" title={issue.address}>
                      <MapPin size={12} color="var(--accent-cyan)" />
                      <span>{issue.address}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-reporter">
                    <span className="cell-reporter-name">
                      {issue.reporterName || "Anonymous"}
                    </span>
                    <span className="cell-reporter-phone">
                      {issue.contact || "—"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="cell-date">
                    <Calendar size={12} style={{ display: "inline", marginRight: 4 }} />
                    {formattedDate}
                  </div>
                </td>
                <td>
                  <ProgressBar percentage={issue.percentage} showLabel={false} />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {issue.percentage}% resolved
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="table-status-select-wrap">
                    <select
                      className={`table-status-select ${getStatusClass(issue.status)}`}
                      value={issue.status}
                      onChange={(e) => handleSelectChange(issue.id, e.target.value)}
                      title="Update ticket status"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="table-manage-btn"
                    onClick={() => onSelectIssue && onSelectIssue(issue)}
                    title="Manage issue details, dispatch officer, and log notes"
                  >
                    <SlidersHorizontal size={13} />
                    <span>Manage</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

