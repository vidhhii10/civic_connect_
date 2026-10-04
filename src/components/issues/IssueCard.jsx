import React from "react";
import { MapPin, Calendar, Volume2, User, Phone } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import ProgressBar from "../common/ProgressBar";

export default function IssueCard({ issue, onClick, showUser = false }) {
  const formattedDate = new Date(issue.timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <article className="issue-card" onClick={() => onClick(issue)}>
      <div className="issue-card-media">
        <img
          src={issue.photo || "/images/sample-issues/street-light.jpg"}
          alt={issue.category}
          className="issue-card-img"
          loading="lazy"
        />
        <div className="issue-card-cat-pill">{issue.category}</div>
        <div className="issue-card-status-pill">
          <StatusBadge status={issue.status} />
        </div>
      </div>

      <div className="issue-card-body">
        <div className="issue-card-location">
          <MapPin size={14} className="location-icon" />
          <span>{issue.address}</span>
        </div>

        <p className="issue-card-desc">{issue.description}</p>

        {showUser && (
          <div className="issue-card-user-row">
            <span className="user-label">
              <User size={13} /> {issue.reporterName}
            </span>
            <span className="user-contact">
              <Phone size={13} /> {issue.contact}
            </span>
          </div>
        )}

        <div className="issue-card-meta">
          <span className="issue-card-date">
            <Calendar size={13} /> {formattedDate}
          </span>
          {issue.audio && (
            <span className="voice-tag" title="Voice note included">
              <Volume2 size={13} /> Voice Note
            </span>
          )}
        </div>

        <div className="issue-card-progress">
          <ProgressBar percentage={issue.percentage} showLabel={true} />
        </div>
      </div>
    </article>
  );
}
