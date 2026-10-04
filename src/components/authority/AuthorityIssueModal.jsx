import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertTriangle,
  Building,
  UserCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  Send,
  MessageSquare,
  History,
  Volume2,
  Shield
} from "lucide-react";
import { useIssues } from "../../context/IssueContext";
import { MUNICIPAL_DEPARTMENTS, FIELD_OFFICERS, ISSUE_PRIORITIES } from "../../services/seedData";

const createId = (prefix) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export default function AuthorityIssueModal({ issue, onClose }) {
  const { updateIssue } = useIssues();

  // Local editable state initialized from issue
  const [status, setStatus] = useState(issue?.status || "Pending");
  const [priority, setPriority] = useState(issue?.priority || "Medium");
  const [department, setDepartment] = useState(
    issue?.department || "Roads & Traffic Works (PWD)"
  );
  const [assignedOfficer, setAssignedOfficer] = useState(
    issue?.assignedOfficer || "Officer Rajesh Kadam"
  );
  const [newNote, setNewNote] = useState("");
  const [authorName] = useState("Officer Rajesh Kadam (Ward R/South)");
  const [feedback, setFeedback] = useState(null);

  if (!issue) return null;

  // Compute SLA target and elapsed time
  const reportedDate = new Date(issue.timestamp);
  const now = new Date();
  const diffHours = Math.max(0, Math.round((now - reportedDate) / (1000 * 60 * 60)));
  const slaTargetHours = issue.priority === "Critical" ? 24 : 48;
  const isBreached = (status !== "Resolved" && status !== "Completed") && diffHours > slaTargetHours;
  const remainingHours = Math.max(0, slaTargetHours - diffHours);

  // Status Change Handler
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);

    let percentage = 0;
    if (newStatus === "Resolved" || newStatus === "Completed") percentage = 100;
    else if (newStatus === "In Progress") percentage = 50;
    else percentage = 0;

    const historyEntry = {
      id: createId("sh"),
      timestamp: new Date().toISOString(),
      status: newStatus,
      updatedBy: "Ward R/South Command",
      note: `Ticket transitioned to ${newStatus}`
    };

    const currentHistory = Array.isArray(issue.statusHistory) ? issue.statusHistory : [];

    updateIssue(issue.id, {
      status: newStatus,
      percentage,
      statusHistory: [...currentHistory, historyEntry]
    });

    showFeedback(`Status updated to ${newStatus} (${percentage}%)`);
  };

  // Department Change Handler
  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    // Find matching officer if possible
    const officerMatch = FIELD_OFFICERS.find((o) => o.department === newDept);
    const newOfficer = officerMatch ? officerMatch.name : assignedOfficer;
    if (officerMatch) {
      setAssignedOfficer(newOfficer);
    }

    const currentHistory = Array.isArray(issue.statusHistory) ? issue.statusHistory : [];
    const historyEntry = {
      id: createId("sh"),
      timestamp: new Date().toISOString(),
      status: status,
      updatedBy: "Ward R/South Command",
      note: `Reassigned to ${newDept} (${newOfficer})`
    };

    updateIssue(issue.id, {
      department: newDept,
      assignedOfficer: newOfficer,
      statusHistory: [...currentHistory, historyEntry]
    });

    showFeedback(`Department assigned to ${newDept}`);
  };

  // Officer Change Handler
  const handleOfficerChange = (newOfficer) => {
    setAssignedOfficer(newOfficer);

    const currentHistory = Array.isArray(issue.statusHistory) ? issue.statusHistory : [];
    const historyEntry = {
      id: createId("sh"),
      timestamp: new Date().toISOString(),
      status: status,
      updatedBy: "Ward R/South Command",
      note: `Field officer dispatched: ${newOfficer}`
    };

    updateIssue(issue.id, {
      assignedOfficer: newOfficer,
      statusHistory: [...currentHistory, historyEntry]
    });

    showFeedback(`Field officer dispatched: ${newOfficer}`);
  };

  // Priority Change Handler
  const handlePriorityChange = (newPrio) => {
    setPriority(newPrio);
    updateIssue(issue.id, { priority: newPrio });
    showFeedback(`Priority set to ${newPrio}`);
  };

  // Add Official Note Handler
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj = {
      id: createId("note"),
      timestamp: new Date().toISOString(),
      author: authorName,
      role: "Ward R/South Inspector",
      text: newNote.trim()
    };

    const currentNotes = Array.isArray(issue.internalNotes) ? issue.internalNotes : [];
    const updatedNotes = [...currentNotes, noteObj];

    updateIssue(issue.id, {
      internalNotes: updatedNotes,
      adminNotes: newNote.trim() // Mirrors to citizen adminNotes for two-way transparency
    });

    setNewNote("");
    showFeedback("Official note logged and synced to citizen records!");
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const internalNotes = Array.isArray(issue.internalNotes) ? issue.internalNotes : [];
  const statusHistory = Array.isArray(issue.statusHistory) ? issue.statusHistory : [];

  return (
    <div className="authority-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="authority-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="authority-modal-header">
          <div className="modal-header-left">
            <span className="modal-ticket-badge">Ticket #{issue.id}</span>
            <span className={`modal-priority-pill priority-${priority.toLowerCase()}`}>
              <AlertTriangle size={12} />
              {priority} Priority
            </span>
            <span className={`modal-status-pill status-${status.toLowerCase().replace(" ", "-")}`}>
              {status === "Resolved" || status === "Completed" ? (
                <CheckCircle2 size={12} />
              ) : status === "In Progress" ? (
                <RefreshCw size={12} />
              ) : status === "Rejected" ? (
                <XCircle size={12} />
              ) : (
                <Clock size={12} />
              )}
              {status}
            </span>
          </div>

          <div className="modal-header-right">
            {feedback && (
              <span className="modal-feedback-toast animate-fade-in">
                ✓ {feedback}
              </span>
            )}
            <button
              className="authority-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="authority-modal-body-grid">
          {/* LEFT COLUMN: Report Details, Photos, Citizen, Notes, Timeline */}
          <div className="modal-details-column">
            {/* Visual Hero & Category */}
            <div className="modal-hero-container">
              <img
                src={issue.photo || "/images/sample-issues/street-light.jpg"}
                alt={issue.category}
                className="modal-hero-photo"
              />
              <div className="modal-hero-overlay">
                <span className="hero-category-tag">{issue.category}</span>
                <span className="hero-location-text">
                  <MapPin size={13} color="var(--accent-cyan)" />
                  {issue.address}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="modal-card-block">
              <h4 className="modal-section-title">Citizen Grievance Description</h4>
              <p className="modal-issue-desc">{issue.description}</p>
            </div>

            {/* Audio Voice Note if present */}
            {issue.audio && (
              <div className="modal-card-block modal-audio-card">
                <div className="modal-audio-title-row">
                  <Volume2 size={16} color="var(--accent-cyan)" />
                  <span className="modal-section-title">Attached Citizen Voice Note</span>
                </div>
                <audio controls src={issue.audio} className="modal-audio-player" />
              </div>
            )}

            {/* Citizen Details & Geospatial Meta */}
            <div className="modal-card-block">
              <h4 className="modal-section-title">Reporter & Location Metadata</h4>
              <div className="modal-meta-grid">
                <div className="meta-box">
                  <User size={15} className="meta-icon" />
                  <div>
                    <span className="meta-label">Citizen Reporter</span>
                    <span className="meta-value">{issue.reporterName || "Anonymous Resident"}</span>
                  </div>
                </div>

                <div className="meta-box">
                  <Phone size={15} className="meta-icon" />
                  <div>
                    <span className="meta-label">Citizen Contact</span>
                    <span className="meta-value">{issue.contact || "Not provided"}</span>
                  </div>
                </div>

                <div className="meta-box">
                  <Calendar size={15} className="meta-icon" />
                  <div>
                    <span className="meta-label">Submission Timestamp</span>
                    <span className="meta-value">
                      {new Date(issue.timestamp).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </span>
                  </div>
                </div>

                <div className="meta-box">
                  <MapPin size={15} className="meta-icon" />
                  <div>
                    <span className="meta-label">Jurisdiction & Coordinates</span>
                    <span className="meta-value">
                      Zone 4 • Ward R/South ({issue.latitude?.toFixed(4)}, {issue.longitude?.toFixed(4)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Notes & Internal Activity Log */}
            <div className="modal-card-block">
              <div className="modal-section-title-row">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MessageSquare size={16} color="var(--accent-cyan)" />
                  <h4 className="modal-section-title" style={{ margin: 0 }}>
                    Official Municipal Notes & Activity Log
                  </h4>
                </div>
                <span className="panel-badge">{internalNotes.length} notes</span>
              </div>

              {/* Note List */}
              <div className="modal-notes-list">
                {internalNotes.length > 0 ? (
                  internalNotes.map((note) => (
                    <div key={note.id} className="modal-note-item">
                      <div className="note-author-row">
                        <div className="note-avatar-dot">
                          <Shield size={12} />
                        </div>
                        <span className="note-author-name">{note.author}</span>
                        {note.role && <span className="note-author-role">({note.role})</span>}
                        <span className="note-time">
                          {new Date(note.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </span>
                      </div>
                      <p className="note-text-body">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-subtext">No internal municipal notes logged yet.</p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="modal-add-note-form">
                <textarea
                  className="modal-note-textarea"
                  placeholder="Enter timestamped official action note, field inspection report, or contractor dispatch update..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <div className="note-quick-actions">
                  <div className="preset-chips">
                    <span className="preset-label">Quick Presets:</span>
                    <button
                      type="button"
                      className="preset-btn"
                      onClick={() => setNewNote("On-site physical inspection completed. Work order initiated.")}
                    >
                      Inspection Completed
                    </button>
                    <button
                      type="button"
                      className="preset-btn"
                      onClick={() => setNewNote("Field maintenance crew dispatched with repair equipment.")}
                    >
                      Crew Dispatched
                    </button>
                    <button
                      type="button"
                      className="preset-btn"
                      onClick={() => setNewNote("Repairs executed and verified on site. Ticket resolved.")}
                    >
                      Work Verified
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm add-note-submit-btn"
                    disabled={!newNote.trim()}
                  >
                    <Send size={14} />
                    <span>Append Official Note</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Status History & Audit Trail */}
            <div className="modal-card-block">
              <div className="modal-section-title-row">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <History size={16} color="var(--accent-cyan)" />
                  <h4 className="modal-section-title" style={{ margin: 0 }}>
                    Status Audit Trail & Timeline
                  </h4>
                </div>
                <span className="panel-badge">{statusHistory.length} events</span>
              </div>

              <div className="modal-timeline">
                {statusHistory.map((item, idx) => (
                  <div key={item.id || idx} className="timeline-event">
                    <div className="timeline-node">
                      <span className="timeline-dot" />
                      {idx < statusHistory.length - 1 && <span className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-top">
                        <span className="timeline-status-badge">{item.status}</span>
                        <span className="timeline-timestamp">
                          {new Date(item.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </span>
                      </div>
                      <p className="timeline-note">{item.note}</p>
                      {item.updatedBy && (
                        <span className="timeline-actor">By: {item.updatedBy}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Operational Dispatch & Controls */}
          <div className="modal-control-column">
            {/* Status Transition Control */}
            <div className="modal-control-panel">
              <h4 className="control-panel-title">
                <RefreshCw size={15} color="var(--accent-cyan)" />
                Status Management
              </h4>
              <p className="control-panel-desc">
                Transition ticket status to update citizen dashboard and SLA tracking.
              </p>

              <div className="status-selector-buttons">
                <button
                  type="button"
                  className={`status-btn btn-pending ${status === "Pending" ? "active" : ""}`}
                  onClick={() => handleStatusChange("Pending")}
                >
                  <Clock size={15} />
                  <span>Pending</span>
                  <span className="status-pct-hint">0%</span>
                </button>

                <button
                  type="button"
                  className={`status-btn btn-progress ${status === "In Progress" ? "active" : ""}`}
                  onClick={() => handleStatusChange("In Progress")}
                >
                  <RefreshCw size={15} />
                  <span>In Progress</span>
                  <span className="status-pct-hint">50%</span>
                </button>

                <button
                  type="button"
                  className={`status-btn btn-resolved ${
                    status === "Resolved" || status === "Completed" ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange("Resolved")}
                >
                  <CheckCircle2 size={15} />
                  <span>Resolved</span>
                  <span className="status-pct-hint">100%</span>
                </button>

                <button
                  type="button"
                  className={`status-btn btn-rejected ${status === "Rejected" ? "active" : ""}`}
                  onClick={() => handleStatusChange("Rejected")}
                >
                  <XCircle size={15} />
                  <span>Rejected</span>
                  <span className="status-pct-hint">0%</span>
                </button>
              </div>
            </div>

            {/* Department Assignment */}
            <div className="modal-control-panel">
              <h4 className="control-panel-title">
                <Building size={15} color="var(--accent-cyan)" />
                Municipal Department
              </h4>
              <p className="control-panel-desc">
                Assign responsible municipal agency for resolution execution.
              </p>

              <select
                className="modal-select-control"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                {MUNICIPAL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Field Officer Dispatch */}
            <div className="modal-control-panel">
              <h4 className="control-panel-title">
                <UserCheck size={15} color="var(--accent-cyan)" />
                Dispatched Field Officer
              </h4>
              <p className="control-panel-desc">
                Assign a designated field engineer for on-ground inspection.
              </p>

              <select
                className="modal-select-control"
                value={assignedOfficer}
                onChange={(e) => handleOfficerChange(e.target.value)}
              >
                {FIELD_OFFICERS.map((officer) => (
                  <option key={officer.id} value={officer.name}>
                    {officer.name} ({officer.role} • {officer.department})
                  </option>
                ))}
              </select>

              {/* Active officer card */}
              <div className="assigned-officer-badge">
                <div className="officer-badge-avatar">
                  <UserCheck size={14} />
                </div>
                <div className="officer-badge-text">
                  <span className="officer-badge-name">{assignedOfficer}</span>
                  <span className="officer-badge-phone">Ward R/South Field Corps</span>
                </div>
              </div>
            </div>

            {/* Priority Level */}
            <div className="modal-control-panel">
              <h4 className="control-panel-title">
                <AlertTriangle size={15} color="var(--accent-cyan)" />
                Priority Level
              </h4>
              <div className="priority-pill-grid">
                {ISSUE_PRIORITIES.map((prio) => (
                  <button
                    key={prio}
                    type="button"
                    className={`priority-select-btn prio-${prio.toLowerCase()} ${
                      priority === prio ? "active" : ""
                    }`}
                    onClick={() => handlePriorityChange(prio)}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>

            {/* SLA Tracker Box */}
            <div className={`modal-sla-box ${isBreached ? "sla-breached" : "sla-ok"}`}>
              <div className="sla-header">
                <Clock size={16} />
                <span className="sla-title">SLA Compliance Tracker</span>
              </div>
              <div className="sla-body">
                <div className="sla-row">
                  <span>Target SLA Window:</span>
                  <strong>{slaTargetHours} Hours ({issue.priority} Priority)</strong>
                </div>
                <div className="sla-row">
                  <span>Time Elapsed:</span>
                  <strong>{diffHours} Hours logged</strong>
                </div>
                <div className="sla-row">
                  <span>SLA Status:</span>
                  {status === "Resolved" || status === "Completed" ? (
                    <span className="sla-tag compliant">Resolved within charter</span>
                  ) : isBreached ? (
                    <span className="sla-tag breached">SLA Breached ({diffHours - slaTargetHours}h overdue)</span>
                  ) : (
                    <span className="sla-tag compliant">{remainingHours}h remaining</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="modal-sidebar-actions">
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={onClose}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
