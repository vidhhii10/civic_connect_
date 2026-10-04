import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  Home,
  MapPin,
  FileEdit,
  LayoutGrid,
  Camera,
  User,
  RotateCcw,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useIssues } from "../../context/IssueContext";

export default function SidebarDrawer({ isOpen, onClose }) {
  const { currentUser } = useUser();
  const { resetToSeed, issues } = useIssues();

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        aria-label="Navigation drawer"
      >
        <div className="drawer-header">
          <div className="drawer-logo-row">
            <img
              src="/logo.svg"
              alt="Civic Connect"
              className="drawer-logo-img"
            />
            <div>
              <h2 className="drawer-app-name">Civic Connect</h2>
              <span className="drawer-app-sub">Report. Build. Connect.</span>
            </div>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} color="#ffffff" />
          </button>
        </div>

        {/* Current Citizen Banner */}
        <div className="drawer-user-card">
          <div className="drawer-avatar">
            <User size={20} color="#38bdf8" />
          </div>
          <div className="drawer-user-info">
            <span className="drawer-user-name">{currentUser.name}</span>
            <span className="drawer-user-role">{currentUser.role} • {currentUser.contact}</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="drawer-nav">
          <Link to="/home" className="drawer-link" onClick={onClose}>
            <Home size={18} />
            <span>Home Screen</span>
          </Link>
          <Link to="/map" className="drawer-link" onClick={onClose}>
            <MapPin size={18} />
            <span>City Issue Map</span>
          </Link>
          <Link to="/report" className="drawer-link" onClick={onClose}>
            <FileEdit size={18} />
            <span>Report Your Issue</span>
          </Link>
          <Link to="/issues" className="drawer-link" onClick={onClose}>
            <LayoutGrid size={18} />
            <span>Issue List / Center</span>
          </Link>
          <Link to="/my-issues" className="drawer-link" onClick={onClose}>
            <Camera size={18} />
            <span>My Tracked Issues</span>
          </Link>
          <Link to="/users" className="drawer-link" onClick={onClose}>
            <User size={18} />
            <span>Users & Citizens</span>
          </Link>
        </nav>

        {/* Quick Stats */}
        <div className="drawer-stats">
          <div className="drawer-stat-item">
            <span className="drawer-stat-num">{issues.length}</span>
            <span className="drawer-stat-label">Total Issues</span>
          </div>
          <div className="drawer-stat-item">
            <span className="drawer-stat-num">
              {issues.filter((i) => i.status === "Completed").length}
            </span>
            <span className="drawer-stat-label">Resolved</span>
          </div>
          <div className="drawer-stat-item">
            <span className="drawer-stat-num">
              {issues.filter((i) => i.status === "In Progress").length}
            </span>
            <span className="drawer-stat-label">In Progress</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="drawer-footer">
          <button
            className="btn btn-secondary btn-block"
            onClick={() => {
              if (window.confirm("Reset mock issues to initial seed data?")) {
                resetToSeed();
                onClose();
              }
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>

          <p className="drawer-copyright">
            Civic Connect • Hackathon Prototype
          </p>
        </div>
      </aside>
    </div>
  );
}
