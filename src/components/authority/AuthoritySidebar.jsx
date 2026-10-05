import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  Building2,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Shield,
  X,
  UserCheck,
  LogOut
} from "lucide-react";

export default function AuthoritySidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const isSupervisor = currentUser?.authorityRole === "supervisor";
  const handleSignOut = () => {
    logout();
    navigate("/authority/login", { replace: true });
  };

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
            to="/authority/dashboard"
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

          {isSupervisor && (
            <>
              <span className="authority-nav-label" style={{ marginTop: 12 }}>
                Operations
              </span>
              <NavLink
                to="/authority/analytics"
                className={({ isActive }) =>
                  `authority-nav-link ${isActive ? "active" : ""}`
                }
                onClick={onClose}
              >
                <div className="authority-nav-link-content">
                  <BarChart3 size={18} />
                  <span>Analytics &amp; SLA</span>
                </div>
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer with Officer Profile */}
        <div className="authority-sidebar-footer">
          <div className="authority-officer-card">
            <div className="officer-avatar">
              <UserCheck size={18} />
            </div>
            <div className="officer-info">
              <span className="officer-title">{currentUser?.name || currentUser?.email}</span>
              <div className="officer-status-row">
                <span>{currentUser?.email}</span>
              </div>
            </div>
          </div>
          <div className="authority-role-badge">
            {isSupervisor ? "Chief Municipal Officer (Supervisor)" : "Field Officer"}
          </div>
          <button type="button" className="authority-signout-btn" onClick={handleSignOut}>
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
