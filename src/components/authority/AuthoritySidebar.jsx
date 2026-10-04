import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  ClipboardList,
  MapPin,
  BarChart3,
  ExternalLink,
  Shield,
  X,
  UserCheck
} from "lucide-react";

export default function AuthoritySidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`authority-sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`authority-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="authority-sidebar-brand">
          <div className="authority-logo-icon">
            <Building2 size={20} />
          </div>
          <div className="authority-brand-text">
            <span className="authority-brand-title">Civic Connect</span>
            <span className="authority-portal-badge">
              <Shield size={10} /> Authority Portal
            </span>
          </div>
          {/* Mobile close button */}
          {isOpen && (
            <button
              className="icon-btn"
              onClick={onClose}
              style={{ marginLeft: "auto" }}
              aria-label="Close sidebar"
            >
              <X size={18} color="#ffffff" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="authority-sidebar-nav">
          <span className="authority-nav-label">Management</span>

          <NavLink
            to="/authority"
            end
            className={({ isActive }) =>
              `authority-nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <div className="authority-nav-link-content">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </NavLink>

          <NavLink
            to="/authority/issues"
            className={({ isActive }) =>
              `authority-nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <div className="authority-nav-link-content">
              <ClipboardList size={18} />
              <span>Issue Management</span>
            </div>
          </NavLink>

          <span className="authority-nav-label" style={{ marginTop: 12 }}>
            Operations & Analytics
          </span>

          <NavLink
            to="/authority/map"
            className={({ isActive }) =>
              `authority-nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <div className="authority-nav-link-content">
              <MapPin size={18} />
              <span>Ward Map</span>
            </div>
          </NavLink>

          <NavLink
            to="/authority/analytics"
            className={({ isActive }) =>
              `authority-nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <div className="authority-nav-link-content">
              <BarChart3 size={18} />
              <span>Analytics & SLA</span>
            </div>
          </NavLink>

          <span className="authority-nav-label" style={{ marginTop: 16 }}>
            Quick Navigation
          </span>

          <Link
            to="/home"
            className="authority-nav-link"
            style={{ color: "var(--text-muted)" }}
            onClick={onClose}
          >
            <div className="authority-nav-link-content">
              <ExternalLink size={16} />
              <span>Citizen View</span>
            </div>
          </Link>
        </nav>

        {/* Sidebar Footer with Officer Profile */}
        <div className="authority-sidebar-footer">
          <div className="authority-officer-card">
            <div className="officer-avatar">
              <UserCheck size={18} />
            </div>
            <div className="officer-info">
              <span className="officer-title">Municipal Officer</span>
              <div className="officer-status-row">
                <span className="online-dot" />
                <span>Ward R/South (Active)</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
