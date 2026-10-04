import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Eye, FileEdit, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useIssues } from "../context/IssueContext";
import { useUser } from "../context/UserContext";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { issues } = useIssues();
  const { currentUser } = useUser();

  const totalCount = issues.length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = issues.filter(
    (i) => i.status === "Completed" || i.status === "Resolved"
  ).length;

  return (
    <div className="home-screen-container">
      {/* Title & Subtitle matching Screenshot 3 */}
      <div className="home-header-block">
        <h1 className="home-main-title">Civic Connect</h1>
        <p className="home-sub-title">Report Issues. Build better cities</p>
      </div>

      {/* Skyline Hero Banner */}
      <div className="home-hero-banner">
        <img
          src="/skyline-hero.jpg"
          alt="City skyline at dusk"
          className="home-skyline-img"
        />
        <div className="home-hero-overlay">
          <div className="home-user-greeting">
            <span>Welcome back, <strong>{currentUser.name.split(" ")[0]}</strong></span>
          </div>
        </div>
      </div>

      {/* Three Main Action Buttons matching Screenshot 3 */}
      <div className="home-actions-list">
        <button
          className="btn btn-primary btn-block home-action-btn"
          onClick={() => navigate("/map")}
        >
          <MapPin size={18} className="btn-icon" />
          <span>View Issue Map</span>
        </button>

        <button
          className="btn btn-primary btn-block home-action-btn"
          onClick={() => navigate("/issues")}
        >
          <Eye size={18} className="btn-icon" />
          <span>View All Issues</span>
        </button>

        <button
          className="btn btn-primary btn-block home-action-btn"
          onClick={() => navigate("/report")}
        >
          <FileEdit size={18} className="btn-icon" />
          <span>Report Your Issue</span>
        </button>
      </div>

      {/* Quick City Impact Card */}
      <div className="home-impact-card">
        <h3 className="impact-card-title">City Issue Pulse</h3>
        <div className="impact-stats-grid">
          <div className="impact-stat">
            <span className="impact-num">{totalCount}</span>
            <span className="impact-label">Total Reported</span>
          </div>
          <div className="impact-stat">
            <span className="impact-num text-progress">{inProgressCount}</span>
            <span className="impact-label">In Progress</span>
          </div>
          <div className="impact-stat">
            <span className="impact-num text-completed">{resolvedCount}</span>
            <span className="impact-label">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
