import React from "react";
import {
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertCircle,
  Volume2,
  Share2
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import ProgressBar from "../common/ProgressBar";

export default function IssueDetailModal({ issue, onClose }) {
  if (!issue) return null;

  const formattedDate = new Date(issue.timestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Civic Connect - ${issue.category}`,
        text: `${issue.description} at ${issue.address}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Civic Issue #${issue.id}: ${issue.category} at ${issue.address}`
      );
      alert("Issue details copied to clipboard!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} color="#ffffff" />
        </button>

        <div className="modal-scroll-content">
          {/* Main Photo Banner */}
          <div className="modal-hero-img-box">
            <img
              src={issue.photo || "/images/sample-issues/street-light.jpg"}
              alt={issue.category}
              className="modal-hero-img"
            />
            <div className="modal-cat-tag">{issue.category}</div>
          </div>

          <div className="modal-body">
            {/* Header info */}
            <div className="modal-title-row">
              <div>
                <span className="modal-ticket-id">Ticket #{issue.id}</span>
                <h3 className="modal-category-title">{issue.category}</h3>
              </div>
              <StatusBadge status={issue.status} />
            </div>

            {/* Progress tracker */}
            <div className="modal-progress-card">
              <ProgressBar percentage={issue.percentage} showLabel={true} />
            </div>

            {/* Location & Date */}
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <MapPin size={16} className="modal-icon" />
                <div>
                  <span className="info-title">Location</span>
                  <p className="info-val">{issue.address}</p>
                </div>
              </div>

              <div className="modal-info-item">
                <Calendar size={16} className="modal-icon" />
                <div>
                  <span className="info-title">Reported On</span>
                  <p className="info-val">{formattedDate}</p>
                </div>
              </div>

              <div className="modal-info-item">
                <User size={16} className="modal-icon" />
                <div>
                  <span className="info-title">Reporter Name</span>
                  <p className="info-val">{issue.reporterName}</p>
                </div>
              </div>

              <div className="modal-info-item">
                <Phone size={16} className="modal-icon" />
                <div>
                  <span className="info-title">Contact</span>
                  <p className="info-val">{issue.contact}</p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="modal-desc-box">
              <h4 className="section-label">Issue Description</h4>
              <p className="modal-desc-text">{issue.description}</p>
            </div>

            {/* Voice recording player if attached */}
            {issue.audio && (
              <div className="modal-audio-box">
                <div className="modal-audio-header">
                  <Volume2 size={16} color="var(--accent-cyan)" />
                  <span className="section-label">Citizen Voice Note</span>
                </div>
                <audio controls src={issue.audio} className="audio-player" />
              </div>
            )}

            {/* Official Municipal / Admin Notes */}
            <div className="modal-admin-notes">
              <div className="admin-notes-header">
                <AlertCircle size={16} color="var(--accent-cyan)" />
                <h4>Municipal Admin Notes</h4>
              </div>
              <p className="admin-notes-content">
                {issue.adminNotes ||
                  "Complaint received and registered with municipal grievance portal. Assigned to zone maintenance officer."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="modal-actions-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleShare}
                style={{ flex: 1 }}
              >
                <Share2 size={16} />
                <span>Share Issue</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
