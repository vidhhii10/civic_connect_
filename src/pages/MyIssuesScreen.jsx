import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Plus,
  AlertCircle,
  Clock,
  RefreshCw,
  CheckCircle2,
  Calendar,
  MapPin,
  Volume2
} from "lucide-react";
import { useIssues } from "../context/IssueContext";
import { useUser } from "../context/UserContext";
import StatusBadge from "../components/common/StatusBadge";
import ProgressBar from "../components/common/ProgressBar";
import IssueDetailModal from "../components/issues/IssueDetailModal";

export default function MyIssuesScreen() {
  const navigate = useNavigate();
  const { issues } = useIssues();
  const { currentUser } = useUser();
  const [activeModalIssue, setActiveModalIssue] = useState(null);

  // Filter issues reported by current active citizen
  const myIssues = issues.filter(
    (i) =>
      i.reporterName.toLowerCase() === currentUser.name.toLowerCase() ||
      i.contact === currentUser.contact
  );

  const pendingCount = myIssues.filter((i) => i.status === "Pending").length;
  const inProgressCount = myIssues.filter((i) => i.status === "In Progress").length;
  const completedCount = myIssues.filter(
    (i) => i.status === "Completed" || i.status === "Resolved"
  ).length;

  return (
    <div className="my-issues-container">
      {/* Citizen Profile Banner */}
      <div className="citizen-profile-card">
        <div className="profile-header-row">
          <div className="profile-avatar-circle">
            <User size={26} color="#38bdf8" />
          </div>
          <div className="profile-info-col">
            <h3 className="profile-name">{currentUser.name}</h3>
            <span className="profile-phone">
              <Phone size={13} /> {currentUser.contact}
            </span>
            <span className="profile-address">{currentUser.address}</span>
          </div>
        </div>

        {/* Citizen Stat Badges */}
        <div className="profile-stats-grid">
          <div className="stat-box">
            <span className="stat-count">{myIssues.length}</span>
            <span className="stat-text">Total Filed</span>
          </div>
          <div className="stat-box">
            <span className="stat-count text-warning">{pendingCount}</span>
            <span className="stat-text">Pending</span>
          </div>
          <div className="stat-box">
            <span className="stat-count text-progress">{inProgressCount}</span>
            <span className="stat-text">In Progress</span>
          </div>
          <div className="stat-box">
            <span className="stat-count text-completed">{completedCount}</span>
            <span className="stat-text">Resolved</span>
          </div>
        </div>
      </div>

      {/* Section Title & Action */}
      <div className="my-issues-section-header">
        <h3 className="section-title">Tracked Issues ({myIssues.length})</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/report")}
        >
          <Plus size={16} />
          <span>New Issue</span>
        </button>
      </div>

      {/* My Issues List matching prompt structure */}
      <div className="my-issues-list">
        {myIssues.length > 0 ? (
          myIssues.map((issue) => (
            <div
              key={issue.id}
              className="my-issue-card"
              onClick={() => setActiveModalIssue(issue)}
            >
              {/* Media banner */}
              <div className="my-issue-media">
                <img
                  src={issue.photo || "/images/sample-issues/street-light.jpg"}
                  alt={issue.category}
                  className="my-issue-img"
                />
                <div className="my-issue-cat-badge">{issue.category}</div>
                <div className="my-issue-status-badge">
                  <StatusBadge status={issue.status} />
                </div>
              </div>

              <div className="my-issue-content">
                {/* Progress Tracking Linear Bar */}
                <div className="my-issue-progress-box">
                  <ProgressBar percentage={issue.percentage} showLabel={true} />
                </div>

                {/* Location & Time */}
                <div className="my-issue-loc">
                  <MapPin size={15} className="location-icon" />
                  <span>{issue.address}</span>
                </div>

                {/* Description */}
                <p className="my-issue-desc">{issue.description}</p>

                {/* Audio voice note indicator if present */}
                {issue.audio && (
                  <div
                    className="my-issue-audio-snippet"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Volume2 size={15} color="var(--accent-cyan)" />
                    <audio controls src={issue.audio} className="audio-player" />
                  </div>
                )}

                {/* Municipal Admin Notes Box */}
                {issue.adminNotes && (
                  <div className="my-issue-admin-notes">
                    <div className="admin-notes-title-row">
                      <AlertCircle size={14} color="var(--accent-cyan)" />
                      <span>Municipal Resolution Note</span>
                    </div>
                    <p className="admin-notes-body">{issue.adminNotes}</p>
                  </div>
                )}

                {/* Reporter & Contact footer */}
                <div className="my-issue-footer">
                  <span className="footer-reporter">
                    Reported by: <strong>{issue.reporterName}</strong>
                  </span>
                  <span className="footer-date">
                    <Calendar size={13} />{" "}
                    {new Date(issue.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-box">
            <AlertCircle size={36} color="var(--text-muted)" />
            <h3>No issues reported yet</h3>
            <p>You haven't submitted any civic complaints under this account.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/report")}
            >
              Report Your First Issue
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalIssue && (
        <IssueDetailModal
          issue={activeModalIssue}
          onClose={() => setActiveModalIssue(null)}
        />
      )}
    </div>
  );
}
