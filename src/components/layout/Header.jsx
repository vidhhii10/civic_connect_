import React from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ title, onOpenMenu, showBack = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current screen title if not provided
  const getScreenTitle = () => {
    if (title) return title;
    switch (location.pathname) {
      case "/home":
        return "Home Screen";
      case "/map":
        return "City Issue Map";
      case "/report":
        return "Issue Reporting";
      case "/issues":
        return "Issue List";
      case "/my-issues":
        return "My Issues";
      case "/users":
        return "Users";
      default:
        return "Civic Connect";
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {showBack ? (
          <button
            className="icon-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </button>
        ) : (
          <button
            className="icon-btn"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <Menu size={22} color="#ffffff" />
          </button>
        )}
      </div>

      <div className="header-title">
        <span>{getScreenTitle()}</span>
      </div>

      <div className="header-right">
        {/* Placeholder spacer to keep title centered */}
        <div style={{ width: 36 }} />
      </div>
    </header>
  );
}
